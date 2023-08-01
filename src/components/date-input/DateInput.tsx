import { useRef, useState } from 'react';
import DateDropdown from './DateDropdown';
import './dateinput.scss';
import moment from 'moment';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

export default function DateInput({ from, to, setValue }: { from: string; to: string; setValue: (from: string, to: string) => void }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeLeft, setActiveLeft] = useState<boolean>(false);
    const [activeRight, setActiveRight] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState((from && moment(from).toDate()) || undefined);
    const [toDate, setToDate] = useState((to && moment(to).toDate()) || undefined);
    const [t] = useTranslation('common');
    useOnClickOutside(wrapperRef, () => {
        setActiveLeft(false);
        setActiveRight(false);
    });

    const updateRange = function (d: Date) {
        let from: Date | undefined = fromDate;
        let to: Date | undefined = toDate;
        let left: boolean = activeLeft;
        let right: boolean = activeRight;
        if (activeLeft) {
            from = d;
            if (to && moment(d).isAfter(to)) {
                to = undefined;
            }
            left = false;
            right = true;
        } else if (activeRight) {
            to = d;
            if (!from || moment(from).isAfter(d)) {
                from = d;
            }
            left = false;
            right = false;
        }
        setActiveLeft(left);
        setActiveRight(right);
        setFromDate(from);
        setToDate(to);
        setValue(moment(from).format('YYYY-MM-DD'), (to && moment(to).format('YYYY-MM-DD')) || '');
    };

    const activateLeft = (f: boolean) => {
        setActiveRight(false);
        setActiveLeft(f);
    };

    const activateRight = (f: boolean) => {
        setActiveRight(f);
        setActiveLeft(false);
    };

    const resetToDate = () => {
        setActiveRight(false);
        setToDate(undefined);
        setValue(moment(from).format('YYYY-MM-DD'), '');
    };

    return (
        <div className="dateinput__container" ref={wrapperRef}>
            <DateValue label={t('search.outbound')} date={from} active={activeLeft} setActive={(f: boolean) => activateLeft(f)} />
            <DateValue label={t('search.return')} date={to} active={activeRight} setActive={(f: boolean) => activateRight(f)} onReset={resetToDate} />
            {activeLeft && <DateDropdown title={t('search.departure_date')} fromDate={fromDate} toDate={toDate} setValue={updateRange} />}
            {activeRight && <DateDropdown title={t('search.return_date')} fromDate={fromDate} toDate={toDate} setValue={updateRange} onReset={resetToDate} />}
        </div>
    );
}

function DateValue({
    date,
    label,
    active,
    setActive,
    onReset,
}: {
    date: string;
    label: string;
    active: boolean;
    setActive: (f: boolean) => void;
    onReset?: () => void;
}) {
    const str: string = (date && moment(date).format('MMMM DD')) || '';
    return (
        <div className={'dateinput__date ' + (active ? 'active' : '')} onClick={() => setActive(true)}>
            <div>
                <div className={'dateinput__date__label ' + (str ? 'focused' : '')}>{label}</div>
                <div className="dateinput__date__value">
                    <div>{str}</div>
                </div>
                {(str.length && onReset && (
                    <div
                        className="dateinput__reset"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReset();
                        }}
                    >
                        <span>
                            <svg name="cross" rotate="">
                                <use xlinkHref="#kb_cross"></use>
                            </svg>
                        </span>
                    </div>
                )) ||
                    ''}
            </div>
        </div>
    );
}
