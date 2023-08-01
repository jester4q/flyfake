import moment from 'moment';
import { TBookPassenger, TCityAirports, TDocumentType, TGender, TPrice, TTicket, TTravelers } from '../types';
import { fetchData } from '../utils/fetchData';

type TBook = {
    ticket?: TTicket;
    travelers?: TTravelers;
    passengers?: TBookPassenger[];
    bookVariant?: 'book' | 'reserve' | '';
    failedPassanger?: number;
    cities?: { [key: string]: TCityAirports };
    code?: string;
    date?: string;
};

export class BookPassenger implements TBookPassenger {
    public citizenship: string = 'RU';
    public dctKind: TDocumentType = 'PASSPORT_RF';
    public dctNo: string = '';
    public dctExpired: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public middleName: string = '';
    public dob: string = '';
    public gender: TGender = '';
    public type: TBookPassenger['type'] = 'adult';
    public card: string = '';
    public error: TBookPassenger['error'] = {};

    constructor(d?: TBookPassenger) {
        d && Object.assign(this, d);
    }

    public validate() {
        this.error = {};
        this.error.citizenship = !!this.citizenship;
        this.error.dctKind = !!this.dctKind;
        this.error.dctNo = !!this.dctNo;
        this.error.dob = !!this.dob;
        this.error.gender = !!this.gender;
        this.error.firstName = this.firstName.length > 1;
        this.error.lastName = this.lastName.length > 1;
    }

    public data() {
        return {
            citizenship: this.citizenship,
            dctKind: this.dctKind,
            dctNo: this.dctNo,
            dctExpired: this.dctExpired,
            firstName: this.firstName,
            lastName: this.lastName,
            middleName: this.middleName,
            dob: this.dob,
            gender: this.gender,
            type: this.type,
            card: this.card,
            error: this.error,
        };
    }
}

export class Book {
    private ticketData: TTicket | undefined;
    private passengersData: TBookPassenger[];
    private travelersData: TTravelers | undefined;
    private variant: 'book' | 'reserve' | '';
    private failedPassanger: number | undefined;

    private fromDate: string = '';
    private toDate: string = '';
    private fromCity: string = '';
    private toCity: string = '';
    private return: boolean = false;
    private cityDict: { [key: string]: TCityAirports };

    private code?: string = '';
    private date?: string = '';

    private avialines: string[] = [];

    constructor(data: TBook) {
        this.travelersData = data.travelers;
        this.ticketData = data.ticket;
        this.passengersData = data.passengers || [];
        this.variant = data.bookVariant || '';
        this.failedPassanger = data.failedPassanger;
        this.code = data.code || '';
        this.date = data.date || '';
        this.updateTicketData();
        this.cityDict = data.cities || {};
    }

    public get path(): { fromDate: string; toDate: string; fromCity: string; toCity: string; return: boolean } {
        return { fromDate: this.fromDate, toDate: this.toDate, fromCity: this.fromCity, toCity: this.toCity, return: this.return };
    }

    public get ticket(): TTicket | null {
        return this.ticketData || null;
    }

    public get passengers(): TBookPassenger[] {
        return this.passengersData || [];
    }

    public get travelers(): TTravelers | null {
        return this.travelersData || null;
    }

    public set ticket(ticket: TTicket | null) {
        this.ticketData = ticket || undefined;
        this.save();
    }

    public set passengers(data: TBookPassenger[]) {
        this.passengersData = data;
        this.save();
    }

    public set travelers(data: TTravelers | null) {
        this.travelersData = data || undefined;
        this.failedPassanger = undefined;
        this.save();
    }

    public get bookVariant(): 'book' | 'reserve' | '' {
        return this.variant;
    }

    public set bookVariant(v: 'book' | 'reserve' | '') {
        this.variant = v;
        this.code = this.rndCode();
        this.date = moment().format('YYYY-MM-DD HH:mm');
        this.save();
    }

    public get reservePrice(): TPrice {
        const p = this.ticket?.price;
        return !p ? { amount: 0, currency: '' } : { amount: p.currency == 'RUB' ? 500 : 5, currency: p.currency };
    }

    public get bookPrice(): TPrice {
        const p = this.ticket?.price;
        return !p ? { amount: 0, currency: '' } : p;
    }

    public get price() {
        return this.bookVariant == 'book' ? this.bookPrice : this.reservePrice;
    }

    public get bookDate(): string {
        return this.date || '';
    }

    public get bookCode(): string {
        return this.code || '';
    }

    public generatePassangers() {
        if (!this.travelersData) {
            this.passengersData = [];
            return [];
        }
        let { adult, child, infant } = this.travelersData;
        const result: TBookPassenger[] = [];
        this.passengersData.forEach((item) => {
            if (item.type == 'adult' && adult > 0) {
                result.push(item);
                adult--;
            }
            if (item.type == 'child' && child > 0) {
                result.push(item);
                child--;
            }
            if (item.type == 'infant' && infant > 0) {
                result.push(item);
                infant--;
            }
        });
        for (let i = 0; i < adult; i++) {
            const p = new BookPassenger();
            p.dctKind = 'PASSPORT_RF';
            p.type = 'adult';
            result.push(p.data());
        }
        for (let i = 0; i < child; i++) {
            const p = new BookPassenger();
            p.dctKind = 'BIRTH_CRTF';
            p.type = 'child';
            result.push(p.data());
        }
        for (let i = 0; i < infant; i++) {
            const p = new BookPassenger();
            p.dctKind = 'BIRTH_CRTF';
            p.type = 'infant';
            result.push(p.data());
        }
        return result.sort((a, b) => {
            const weight = { adult: 0, child: 1, infant: 2 };
            const x = weight[a.type];
            const y = weight[b.type];
            return x - y;
        });
    }

    public validated() {
        return this.failedPassanger !== undefined;
    }

    public failedPassangerIndex(): number {
        return this.failedPassanger !== undefined ? this.failedPassanger : -1;
    }

    public validate() {
        let { adult, child, infant } = this.travelersData || { adult: 0, child: 0, infant: 0 };
        this.failedPassanger = -1;
        this.passengersData.forEach((p, i) => {
            const passenger = new BookPassenger(p);
            passenger.validate();
            if (passenger.type == 'adult') {
                adult--;
            }
            if (passenger.type == 'child') {
                child--;
            }
            if (passenger.type == 'infant') {
                infant--;
            }

            const failed = Object.values(passenger.error).reduce((v, e) => v || !e, false);
            if (failed && this.failedPassanger === -1) {
                this.failedPassanger = i;
            }
        });
        if (adult || child || infant) {
            return false;
        }
        return this.failedPassanger === -1;
    }

    public async loadCities() {
        if (!this.ticket) {
            return;
        }
        const cities = this.ticket.list.map((item) => item.depatureCity);
        cities.push(this.ticket.list[this.ticket.list.length - 1].arrivalCity);
        const dict: any = {};
        for (let i = 0; i < cities.length; i++) {
            const query = cities[i];
            if (!dict[query]) {
                const city = await fetchData<TCityAirports[]>(`/airport/search?str=${query}`);
                if (city?.length) {
                    dict[query] = city[0];
                }
            }
        }
        this.cityDict = dict;
        this.save();
    }

    public get cities(): { [key: string]: TCityAirports } {
        return this.cityDict;
    }

    private save() {
        saveBook({
            ticket: this.ticketData,
            passengers: this.passengersData,
            travelers: this.travelersData,
            bookVariant: this.variant,
            failedPassanger: this.failedPassanger,
            cities: this.cityDict,
            date: this.date,
            code: this.code,
        });
    }

    private rndCode() {
        const length = 6;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    private updateTicketData() {
        this.fromCity = '';
        this.toCity = '';
        this.fromDate = '';
        this.toDate = '';
        this.return = false;
        this.avialines = [];
        if (this.ticketData && this.ticketData.list) {
            this.fromCity = this.ticketData.list[0].depatureCity;
            this.fromDate = this.ticketData.list[0].depatureTime;
            this.toDate = this.ticketData.list[this.ticketData.list.length - 1].arrivalTime;
            let i = 0;
            /* eslint-disable */
            for (i; i < this.ticketData.list.length - 1 && this.ticketData.list[i].transferDuration > 0; i++) {}
            this.toCity = this.ticketData.list[i].arrivalCity;
            this.return = i < this.ticketData.list.length - 1;
            this.avialines = this.ticketData.list.reduce<string[]>((a, i) => {
                if (!a.includes(i.airline)) {
                    a.push(i.airline);
                }
                return a;
            }, []);
        }
    }
}

//let book: Book | undefined;

export function factoryBook(): Book {
    //if (!book) {
    let data = {};
    try {
        const val = localStorage.getItem('ff.book');

        if (val) {
            data = JSON.parse(val);
            data;
        }
    } catch (e) {
        data = {};
    }
    const book = new Book(data);
    //}

    return book;
}

export function clearBook() {
    saveBook({});
    let book = undefined;
}

function saveBook(data: TBook) {
    localStorage.setItem('ff.book', JSON.stringify(data));
}
