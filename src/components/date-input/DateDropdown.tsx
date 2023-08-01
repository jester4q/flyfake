import './date-dropdown.scss';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useTranslation } from 'react-i18next';

import { ru } from 'date-fns/locale';

type TDateState = {
    from?: Date;
    to?: Date;
    enteredTo?: Date;
};

export default function DateDropdown({
    title,
    setValue,
    fromDate,
    toDate,
    onReset,
}: {
    title: string;
    setValue: (d: Date) => void;
    fromDate?: Date;
    toDate?: Date;
    onReset?: () => void;
}) {
    //const [state, setState] = useState<TDateState>({ from: fromDate, to: toDate });
    //const { from, to, enteredTo } = state;
    // const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: new Date(), after: undefined };
    const selectedDays = { from: fromDate, to: toDate };

    const [t, i18nConfig] = useTranslation('common');
    const lng = i18nConfig.language;

    const getInitialState = () => {
        return {};
    };

    const handleResetClick = () => {
        // setState(getInitialState());
    };

    /*
    const isSelectingFirstDay = (day: Date, from?: Date, to?: Date) => {
        const isBeforeFirstDay = from && moment(day).isBefore(from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    };
    */
    const handleDayClick = (day: Date) => {
        setValue(day);
        /*
        const { from, to } = state;
        if (from && to && day >= from && day <= to) {
            handleResetClick();
            return;
        }
        if (isSelectingFirstDay(day, from, to)) {
            setState({
                from: day,
                to: undefined,
                enteredTo: undefined,
            });
        } else {
            setState({
                from: from,
                to: day,
                enteredTo: day,
            });
            setRange(from!, day);
        }
        */
    };

    /*
    const handleDayMouseEnter = (day: Date) => {
        const { from, to } = state;
        if (!isSelectingFirstDay(day, from, to)) {
            setState({
                from: from,
                to: to,
                enteredTo: day,
            });
        }
    };
    */

    return (
        <div className="date-dropdown">
            <div>
                <div className="date-dropdown__header">
                    <h1>{title}</h1>
                    {onReset && (
                        <div className="date-dropdown__reset">
                            <button onClick={onReset}>
                                <span>{t('search.return_not_need')}</span>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <DayPicker
                        className="Range"
                        numberOfMonths={2}
                        mode="range"
                        fromMonth={new Date()}
                        disableNavigation={false}
                        selected={selectedDays}
                        disabled={disabledDays}
                        onDayClick={handleDayClick}
                        locale={lng === 'ru' ? ru : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
