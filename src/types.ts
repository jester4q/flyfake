export type TCityAirports = {
    name: { en: string; ru: string };
    country: { en: string; ru: string };
    code: string;
    airports: {
        name: { en: string; ru: string };
        code: string;
    }[];
};

export type TAirport = {
    city: string;
    country: string;
    cityCode: string;
    airportCode: string;
    airport: string;
    isCity: boolean;
    isOne: boolean;
} & TSelected;

export type TSelected = {
    code: string;
    name: string;
};

export type TPrice = { amount: number; currency: string };

export type TLanguage = 'EN' | 'RU';
export type TCurrency = 'USD' | 'RUB';
export type TCabin = 'business' | 'economy';
export type TPassengerType = 'adult' | 'child' | 'infant';
export type TDocumentType = 'PASSPORT_RF' | 'PASSPORT_ITN' | 'BIRTH_CRTF' | 'PASSPORT_ID';
export type TGender = 'Male' | 'Female' | '';

export type TTravelers = {
    adult: number;
    child: number;
    infant: number;
};

export type TSearchFilter = {
    departure?: TAirport;
    arrival?: TAirport;
    fromDate: string;
    toDate?: string;
    cabin: TCabin;
    travelers: TTravelers;
    language: TLanguage;
    currency: TCurrency;
};

export type TTicketTrip = {
    flyNumber: string;
    airline: string;
    transport: string;
    depatureCity: string;
    depatureAirportCode: string;
    depatureTime: string;
    depatureAirportName: string;
    arrivalCity: string;
    arrivalAirportCode: string;
    arrivalTime: string;
    arrivalAirportName: string;
    transferDuration: number;
    duration: number;
};

export type TTicket = {
    price: TPrice;
    cheapest: boolean;
    id: string;
    list: TTicketTrip[];
};

export type TTrip = {
    flyghtNumber: string;
    transport: string;
    depatureTime: string;
    depatureDate: string;
    depatureAirportName: string;
    depatureAirportCode: string;
    arrivalTime: string;
    arrivalDate: string;
    arrivalAirportName: string;
    arrivalAirportCode: string;
    path: { code: string; duration: number }[];
    duration: number;
    flightDuration: number;
    stops: number;
};

export type TTripDetailedItem = {
    flyghtNumber: string;
    airline: string;
    transport: string;
    depatureTime: string;
    depatureDate: string;
    depatureCity: string;
    depatureAirportName: string;
    depatureAirportCode: string;
    arrivalCity: string;
    arrivalTime: string;
    arrivalDate: string;
    arrivalAirportName: string;
    arrivalAirportCode: string;
    duration: number;
    transfer: number;
};

export type TTripDetailed = {
    fromCity: string;
    toCity: string;
    path: TTripDetailedItem[];
};

export type TPassengers = {
    cabin: TCabin;
    travelers: TTravelers;
};

export type TDictItem = {
    id: string;
    title: string;
    shortTitle?: string;
    icon?: any;
    symbol?: string;
};

export type TLngCurPair = {
    language: TLanguage;
    currency: TCurrency;
};

export type TBookPassenger = {
    citizenship: string;
    dctKind: TDocumentType;
    dctNo: string;
    dctExpired: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dob: string;
    gender: TGender;
    type: TPassengerType;
    card: string;
    error: {
        citizenship?: boolean;
        dctKind?: boolean;
        dctNo?: boolean;
        dctExpired?: boolean;
        firstName?: boolean;
        lastName?: boolean;
        middleName?: boolean;
        dob?: boolean;
        gender?: boolean;
        type?: boolean;
        card?: boolean;
    };
};
