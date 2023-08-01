import './date.scss';
import Input from '../input/Input';
import SelectBox from '../selectbox/SelectBox';
import { MONTHS } from '../../../data/dict';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Date({ value, label, setValue, failed }: { value: string; label?: string; setValue?: (v: string) => void; failed?: boolean }) {
    const [t] = useTranslation('common');
    let date: moment.Moment | null = null;
    if (value && moment(value).isValid()) {
        date = moment(value);
    }
    const [day, setDay] = useState<string>((date && date.format('DD')) || '');
    const [month, setMonth] = useState<string>((date && date.month().toString()) || '0');
    const [year, setYear] = useState<string>((date && date.format('YYYY')) || '');
    const [valid, setValid] = useState<boolean>((day && month && year && !!date) || false);

    const changeMonth = (v: string) => {
        const m = parseInt(v);
        if (m > 0 && m < 13) {
            setDate(year, v, day);
        }
        setMonth(v);
    };

    const changeDay = (v: string) => {
        const d = parseInt(v);
        if (d > 0 && d < 32) {
            setDate(year, month, v);
        }
        setDay(v);
    };

    const changeYear = (v: string) => {
        const y = parseInt(v);
        if (y > 0) {
            setDate(v, month, day);
        }
        setYear(v);
    };

    const setDate = (year: string, month: string, day: string) => {
        const m = parseInt(month);
        const d = parseInt(day);
        const y = parseInt(year);
        if (day && month && year) {
            date = moment(`${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
            let value = '';
            if (date.isValid()) {
                value = date.format('YYYY-MM-DD');
            }
            setValid(!!value);
            setValue && setValue(value);
        }
    };

    const isValidDay = !failed && (!day || valid);
    const isValidMonth = !failed && (!month || month == '0' || valid);
    const isValidYear = !failed && (!year || valid);

    return (
        <div className="date">
            {label && <span className="date__label">{label}</span>}
            <div className="date__container">
                <div className="date__input">
                    <Input placeholder={t('date.day')} value={day} setValue={changeDay} failed={!isValidDay} />
                </div>
                <div className="date__month">
                    <SelectBox placeholder={t('date.month')} dict={MONTHS} value={month} setValue={changeMonth} failed={!isValidMonth} />
                </div>
                <div className="date__input">
                    <Input placeholder={t('date.year')} value={year} setValue={changeYear} failed={!isValidYear} />
                </div>
            </div>
        </div>
    );
}
