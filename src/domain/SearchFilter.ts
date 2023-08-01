import moment from 'moment';
import { TAirport, TCabin, TCurrency, TLanguage, TSearchFilter, TSelected, TTravelers } from '../types';

export class SearchFilter {
    constructor(private data: TSearchFilter) {}

    public get departure(): TAirport | undefined {
        return (this.data && this.data.departure) || undefined;
    }

    public get arrival(): TAirport | undefined {
        return (this.data && this.data.arrival) || undefined;
    }

    public get fromDate(): string {
        return (this.data && this.data.fromDate) || '';
    }

    public get toDate(): string {
        return (this.data && this.data.toDate) || '';
    }

    public get language(): TLanguage {
        return (this.data && this.data.language) || 'EN';
    }

    public get currancy(): TCurrency {
        return (this.data && this.data.currency) || 'USD';
    }

    public get cabin(): TCabin {
        return (this.data && this.data.cabin) || 'economy';
    }

    public get travelers(): TTravelers {
        return (this.data && this.data.travelers) || { adult: 1, child: 0, infant: 0 };
    }

    public set departure(v: TAirport | undefined) {
        this.data.departure = v;
        saveSearchFilter(this.data);
    }

    public set arrival(v: TAirport | undefined) {
        this.data.arrival = v;
        saveSearchFilter(this.data);
    }

    public set fromDate(v: string) {
        if (moment(v, 'YYYY-MM-DD').isValid()) {
            this.data.fromDate = v;
            saveSearchFilter(this.data);
        }
    }

    public set toDate(v: string) {
        this.data.toDate = v && moment(v, 'YYYY-MM-DD').isValid() ? v : '';
        saveSearchFilter(this.data);
    }

    public set cabin(v: TCabin) {
        this.data.cabin = v;
        saveSearchFilter(this.data);
    }

    public set travelers(v: TTravelers) {
        this.data.travelers = v;
        saveSearchFilter(this.data);
    }

    public set language(v: TLanguage) {
        this.data.language = v;
        saveSearchFilter(this.data);
    }

    public set currancy(v: TCurrency) {
        this.data.currency = v;
        saveSearchFilter(this.data);
    }

    public getFilter(): TSearchFilter {
        return JSON.parse(JSON.stringify(this.data));
    }
}

let filter: SearchFilter;

export function factorySearchFilter() {
    if (!filter) {
        let data: TSearchFilter = {
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: '',
            arrival: undefined,
            departure: undefined,
            cabin: 'economy',
            travelers: { adult: 1, child: 0, infant: 0 },
            language: 'EN',
            currency: 'USD',
        };
        try {
            const val = localStorage.getItem('ff.search-filter');

            if (val) {
                data = JSON.parse(val);
                if (!data.fromDate || !moment(data.fromDate, 'YYYY-MM-DD').isValid()) {
                    data.fromDate = moment().format('YYYY-MM-DD');
                }
                if (typeof data.departure === 'string') {
                    delete data.departure;
                }
                if (typeof data.arrival === 'string') {
                    delete data.arrival;
                }
            }
        } catch (e) {
            saveSearchFilter(data);
        }
        filter = new SearchFilter(data);
    }
    return filter;
}

function saveSearchFilter(data: TSearchFilter) {
    localStorage.setItem('ff.search-filter', JSON.stringify(data));
}
