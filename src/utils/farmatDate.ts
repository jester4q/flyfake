import moment from 'moment';

export function formatDate(date: string, format: string) {
    const utc = date.split('+')[0];
    console.log(date, utc, moment(utc).format(format));
    return moment(utc).format(format);
}
