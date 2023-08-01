import PdfPrinter from 'pdfmake/build/pdfmake';
import PdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { factoryBook } from '../domain/Book';

import moment from 'moment';
import { TBookPassenger, TCityAirports, TTicketTrip } from '../types';
import { formatDate } from '../utils/farmatDate';

function base64convert(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((r) => r.blob())
            .then((b) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve((e.target?.result && String(e.target.result)) || '');
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(b);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

export class TicketPrinter {
    constructor() {}

    public async generatePDF(): Promise<void> {
        PdfFonts.pdfMake.vfs['DejaVuSans_normal'] = (await base64convert('/fonts/DejaVuSans.ttf')).replace('data:font/ttf;base64,', '');
        PdfFonts.pdfMake.vfs['DejaVuSans_bold'] = (await base64convert('/fonts/DejaVuSans-Bold.ttf')).replace('data:font/ttf;base64,', '');
        PdfFonts.pdfMake.vfs['DejaVuSans_italics'] = (await base64convert('/fonts/DejaVuSans-Oblique.ttf')).replace('data:font/ttf;base64,', '');
        PdfFonts.pdfMake.vfs['DejaVuSans_bolditalics'] = (await base64convert('/fonts/DejaVuSans-BoldOblique.ttf')).replace('data:font/ttf;base64,', '');

        console.log(PdfFonts.pdfMake.vfs);

        const fonts = {
            DejaVuSans: {
                normal: 'DejaVuSans_normal',
                bold: 'DejaVuSans_bold',
                italics: 'DejaVuSans_italics',
                bolditalics: 'DejaVuSans_bolditalics',
            },
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf',
            },
        };

        const book = factoryBook();
        const path = book.path;
        const cityDict = book.cities;
        const fromCity = cityDict[path.fromCity];
        const toCity = cityDict[path.toCity];
        const passengerHeight = book.passengers.length * 10;
        const transfers = book.ticket!.list.reduce((s, i) => s + (i.transferDuration > 0 ? 1 : 0), 0);
        const flightsHeight = book.ticket!.list.length * 4 * 10 + transfers * 15;

        const docDefinition: TDocumentDefinitions = {
            // a string or { width: number, height: number }
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish
            pageOrientation: 'portrait',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
            pageMargins: [14, 18.7, 14, 18.7],
            content: [
                /*
                {
                    width: 113.8,
                    height: 38.2,
                    image: await base64convert('/img/logo.png'),
                    marginLeft: 6.0,
                },
                */
                {
                    text: 'Itinerary receipt / Маршрутная квитанция',
                    fontSize: 14.0,
                    bold: false,
                    alignment: 'center',
                    margin: [0, 13.8, 0, 0],
                },
                {
                    layout: 'noBorders',
                    margin: [3.0, 8.0, 3, 9.4],
                    table: {
                        headerRows: 0,
                        widths: ['*', '*'],
                        body: [
                            [
                                { text: 'Reservation date / Дата бронирования:', bold: true, style: 'bookingRow' },
                                { text: moment().format(book.bookDate), style: 'bookingRow' },
                            ],
                            [
                                { text: 'Reservation code / Код бронирования:', bold: true, style: 'bookingRow' },
                                { text: book.bookCode, style: 'bookingRow' },
                            ],
                            [
                                { text: 'Status / Статус:', bold: true, style: 'bookingRow' },
                                { text: 'Confirmed / Подтверждено', style: 'bookingRow' },
                            ],
                        ],
                    },
                },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 567, y2: 0, lineWidth: 0.5, lineColor: '#999999' }] },

                {
                    marginTop: 8.5,
                    canvas: [
                        { type: 'rect', x: 0.4, y: 0.4, w: 566.3, h: 16.1, lineWidth: 0, color: '#dee5eb', r: 1 },
                        { type: 'rect', x: 0.4, y: 16.0, w: 566.3, h: 1, lineWidth: 0, color: '#dee5eb', r: 0 },
                        { type: 'line', x1: 0, y1: 17.1, x2: 567, y2: 17.1, lineWidth: 0.6, lineColor: '#ced4d9' },
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 567,
                            h: 41.3 + passengerHeight,
                            r: 3,
                            lineColor: '#ced4d9',
                            lineWidth: 0.5,
                        },
                    ],
                },
                {
                    width: 6,
                    height: 13,
                    image: await base64convert('/img/person.png'),
                    relativePosition: { x: 5.8, y: -43.3 - passengerHeight + 4.0 },
                },
                {
                    layout: 'noBorders',
                    fontSize: 8,
                    margin: [8.5, 0, 8.5, 0],
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                            ],
                            [
                                {
                                    text: 'Passengers information / Информация о пассажирах',
                                    colSpan: 3,
                                    bold: true,
                                    alignment: 'center',
                                    heigh: 17.7,
                                    marginBottom: 5.9,
                                },
                            ],
                            [
                                { text: 'Passenger / Пассажир', bold: true, style: 'passengerRow' },
                                { text: 'Birthday / Дата рождения', bold: true, style: 'passengerRow' },
                                { text: 'Document / Документ', bold: true, style: 'passengerRow' },
                            ],
                            ...this.passengers(book.passengers),
                        ],
                    },
                    relativePosition: { x: 0, y: -43.3 - passengerHeight },
                },

                {
                    marginTop: 8.5,
                    canvas: [
                        { type: 'rect', x: 0.4, y: 0.4, w: 566.3, h: 16.1, lineWidth: 0, color: '#dee5eb', r: 1 },
                        { type: 'rect', x: 0.4, y: 16.0, w: 566.3, h: 1, lineWidth: 0, color: '#dee5eb', r: 0 },
                        { type: 'line', x1: 0, y1: 17.1, x2: 567, y2: 17.1, lineWidth: 0.6, lineColor: '#ced4d9' },
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 567,
                            h: 127.5 - 95 + flightsHeight,
                            r: 3,
                            lineColor: '#ced4d9',
                            lineWidth: 0.5,
                        },
                    ],
                },
                {
                    width: 14.6,
                    height: 9.4,
                    image: await base64convert('img/airplan.png'),
                    relativePosition: { x: 5.8, y: -129.5 + 95 - flightsHeight + 7 },
                },
                {
                    layout: 'noBorders',
                    fontSize: 7,
                    margin: [8.4, 0, 8.4, 0],
                    table: {
                        headerRows: 1,
                        widths: [103, '*', '*'],
                        body: [
                            [
                                { text: '', height: 0 },
                                { text: '', height: 0 },
                                { text: '', height: 0 },
                            ],
                            [
                                {
                                    text: `${fromCity.name.en} - ${toCity.name.en} / ${fromCity.name.ru} - ${toCity.name.ru}`,
                                    colSpan: 3,
                                    bold: true,
                                    alignment: 'center',
                                    heigh: 17.7,
                                    fontSize: 8,
                                    marginBottom: 6.5,
                                },
                            ],
                            [
                                { text: 'Flight / Рейс', bold: true, marginBottom: 0 },
                                { text: 'Departing / Отправление', bold: true, marginBottom: 0 },
                                { text: 'Arriving / Прибытие', bold: true, marginBottom: 0 },
                            ],

                            ...this.flights(book.ticket!.list, cityDict),
                        ],
                    },
                    relativePosition: { x: 0, y: -129.5 + 95 - flightsHeight },
                },
                {
                    marginTop: 5.8,
                    canvas: [
                        { type: 'rect', x: 0.4, y: 0.4, w: 566.3, h: 16.1, lineWidth: 0, color: '#dee5eb', r: 1 },
                        { type: 'rect', x: 0.4, y: 16.0, w: 566.3, h: 1, lineWidth: 0, color: '#dee5eb', r: 0 },
                        { type: 'line', x1: 0, y1: 17.1, x2: 567, y2: 17.1, lineWidth: 0.6, lineColor: '#ced4d9' },
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 567,
                            h: 53.5,
                            r: 3,
                            lineColor: '#ced4d9',
                            lineWidth: 0.5,
                        },
                    ],
                },
                {
                    width: 10.7,
                    height: 12.1,
                    image: await base64convert('img/info.png'),
                    relativePosition: { x: 5.8, y: -55.5 + 4.8 },
                },
                {
                    layout: 'noBorders',
                    fontSize: 8,
                    margin: [8.5, 0, 8.5, 0],
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                                { text: '', height: 0, margin: [0, 0, 0, 0] },
                            ],
                            [{ text: 'Payment information / Сведения об оплате', colSpan: 3, bold: true, alignment: 'center', heigh: 17.7, marginBottom: 5.9 }],
                            [
                                { text: 'Fare / Тариф', bold: true, style: 'passengerRow' },
                                { text: 'Service fee / Сервисный сбор', bold: true, style: 'passengerRow' },
                                { text: 'Total cost / Общая стоимость', bold: true, style: 'passengerRow' },
                            ],
                            [
                                { text: Price(book.bookPrice), style: 'fareRow' },
                                {
                                    text: Price(book.bookPrice.currency === 'RUB' ? { amount: 100, currency: 'RUB' } : { amount: 1, currency: 'USD' }),
                                    style: 'fareRow',
                                },
                                {
                                    text: Price(
                                        book.bookPrice.currency === 'RUB'
                                            ? { amount: +book.bookPrice.amount + 100, currency: 'RUB' }
                                            : { amount: +book.bookPrice.amount + 1, currency: 'USD' },
                                    ),
                                    style: 'fareRow',
                                },
                            ],
                        ],
                    },
                    relativePosition: { x: 0, y: -55.5 },
                },
                {
                    marginTop: 5.8,
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 567,
                            h: 17.2,
                            r: 3,
                            color: '#fae49a',
                        },
                    ],
                },
                {
                    width: 11.5,
                    height: 10.9,
                    image: await base64convert('img/warning.png'),
                    relativePosition: { x: 5.8, y: -17.2 + 3 },
                },
                {
                    text: 'Warning! / Внимание!',
                    fontSize: 8,
                    bold: true,
                    alignment: 'center',
                    relativePosition: { x: 0, y: -17.2 + 3.8 },
                },
                {
                    layout: 'noBorders',
                    fontSize: 6,
                    marginTop: 4,
                    table: {
                        headerRows: 0,
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    style: 'warning',
                                    ul: [
                                        { text: 'Departures and Arrivals are in local time for each airport.' },
                                        'The airline may change the flights timetable. Please be sure to check your flight departure time 24 hours before the flight.',
                                        'The quantity of baggage items is the quantity of bags that you can check in as baggage. You can check the exact weight or dimensions of the baggage allowed on the airline’s website.',
                                        'Check-in is complete 60 min. before to departure unless the carrier announces otherwise.',
                                        'The ticket is only valid when presented with a valid form of ID issued in the name of the person holding the ticket: national document or travel passport.',
                                    ],
                                },
                                {
                                    style: 'warning',
                                    ul: [
                                        'Дата и время вылета и прилета указаны по местному времени для каждого аэропорта.',
                                        'Авиакомпания может изменить расписание полетов. Пожалуйста, уточните время отправления Вашего рейса за сутки до вылета.',
                                        'Точный вес или размер багажа, разрешенный для вашего тарифа, можно узнать на сайте авиакомпании. Число мест багажа — это количество мест, которое можно сдать в багаж. При превышении нормы бесплатного провоза багажа пассажир обязан оплатить сверхнормативный багаж',
                                        'Регистрация на рейс заканчивается за 60 мин. до отправления, если иное не установлено перевозчиком.',
                                        'Для регистрации в аэропорту необходимо предъявить паспорт.',
                                    ],
                                },
                            ],
                        ],
                    },
                },
            ],
            defaultStyle: {
                font: 'DejaVuSans',
            },
            styles: {
                flightSingleRow: {
                    fontSize: 7,
                    lineHeight: 0.6,
                    noWrap: true,
                    margin: [0, 0, 0, 0],
                },
                bookingRow: {
                    fontSize: 8,
                    lineHeight: 0.8,
                    noWrap: true,
                    margin: [0, 0, 0, 0],
                },
                passengerRow: {
                    fontSize: 8,
                    lineHeight: 0.8,
                    noWrap: true,
                    margin: [0, 0, 0, 0],
                },
                fareRow: {
                    fontSize: 9,
                    lineHeight: 0.8,
                    noWrap: true,
                    margin: [0, 0, 0, 0],
                    font: 'Roboto',
                },
                warning: {
                    lineHeight: 1.2,
                    marginLeft: 4,
                    marginRight: 4,
                },
            },
        };

        const pdfDoc = PdfPrinter.createPdf(docDefinition, undefined, fonts, PdfFonts.pdfMake.vfs);
        pdfDoc.download();
    }

    private passengers(passangers: TBookPassenger[]): { text: string; style: string }[][] {
        return passangers.map((p) => [
            { text: `${p.firstName} ${p.lastName}`, style: 'passengerRow' },
            { text: moment(p.dob).format('DD.MM.YYYY'), style: 'passengerRow' },
            { text: p.dctNo, style: 'passengerRow' },
        ]);
    }

    private flights(list: TTicketTrip[], cityDict: { [key: string]: TCityAirports }): TableCell[][] {
        const result = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            result.push([
                {
                    layout: 'noBorders',
                    marginTop: -4,
                    style: 'flightSingleRow',
                    table: {
                        headerRows: 0,
                        marginTop: 0,
                        widths: ['*'],
                        body: [[{ text: item.flyNumber }], [{ text: item.airline }], [{ text: item.transport }], [{ text: 'Economy / Эконом' }]],
                    },
                },

                {
                    layout: 'noBorders',
                    marginTop: -4,
                    style: 'flightSingleRow',
                    table: {
                        headerRows: 0,
                        widths: [40, '*'],
                        body: [
                            [{ text: formatDate(item.depatureTime, 'DD.MM.YYYY') }, { text: cityDict[item.depatureCity].name.en }],
                            [{ text: formatDate(item.depatureTime, 'HH:mm'), bold: true }, { text: cityDict[item.depatureCity].name.ru }],
                            [{ text: '' }, { text: '' }],
                            [{ text: [{ text: 'Flight time / Время в пути:   ', bold: true }, { text: DHMOnBothLng(item.duration) }], colSpan: 2 }],
                        ],
                    },
                },
                {
                    layout: 'noBorders',
                    marginTop: -4,
                    style: 'flightSingleRow',
                    table: {
                        headerRows: 0,
                        widths: [40, '*'],
                        body: [
                            [{ text: formatDate(item.arrivalTime, 'DD.MM.YYYY') }, { text: cityDict[item.arrivalCity].name.en }],
                            [{ text: formatDate(item.arrivalTime, 'HH:mm'), bold: true }, { text: cityDict[item.arrivalCity].name.ru }],
                        ],
                    },
                },
            ]);
            if (item.transferDuration) {
                result.push([
                    { colSpan: 3, text: [{ text: 'Transfer / Пересадка:   ', bold: true }, DHMOnBothLng(item.transferDuration)], margin: [0, 2.5, 0, 2.5] },
                ]);
            }
        }

        console.log(result);
        return result;
    }
}

function DHMOnBothLng(value: number) {
    const flight = [0, Math.floor(value / 60), value % 60];
    flight[0] = Math.floor(flight[1] / 24);
    if (flight[0] > 0) {
        flight[1] -= flight[0] * 24;
    }

    return `${flight[0] ? `${flight[0]} d ` : ''} ${flight[1]} h ${flight[2]} min / ${flight[0] ? `${flight[0]} д ` : ''} ${flight[1]} ч ${flight[2]} мин`;
}

export default function Price(price: { currency: string; amount: number }) {
    return `${(price.currency == 'USD' && '$ ') || ''} ${price.amount} ${(price.currency == 'RUB' && ' ₽') || ''}`;
}
