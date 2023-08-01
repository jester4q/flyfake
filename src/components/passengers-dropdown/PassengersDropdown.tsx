import { useRef, useState } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './passengers-dropdown.scss';
import PassengersDropdownForm from './PassengersDropdownForm';
import { TPassengers } from '../../types';
import { useTranslation } from 'react-i18next';

export function PassengersDropdown({ value, setValue }: { value: TPassengers; setValue: (v: TPassengers) => void }) {
    const [active, setActive] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [t] = useTranslation('common');

    useOnClickOutside(wrapperRef, () => setActive(false));

    const focusClassName = function () {
        return active ? ' focused' : '';
    };

    const pax = (value && value.travelers.adult + value.travelers.child + value.travelers.infant) || 0;

    return (
        <div className="passengers-dropdown" ref={wrapperRef}>
            <div className={'passengers-dropdown__content' + focusClassName()} onClick={() => setActive(() => !active)}>
                <div className="passengers-dropdown__label">
                    <div className="">{t('search.passengers_and_class')}</div>
                    <span>
                        {pax}&nbsp;&nbsp;{t('search.pax')}
                    </span>
                    <span>,&nbsp;&nbsp;{t('search.' + value.cabin)}</span>
                </div>
                {/*
                <span className="passengers-dropdown__icon">
                    <svg
                        className="styled__IconSvg-sc-o1jnik-0 bEAliw styled__StyledInputIcon-sc-1tzcnkx-2 kqUacm"
                        fill="colorTextDescriptionNormal"
                        name="user_outline"
                        rotate=""
                    >
                        <use xlinkHref="#kb_user_outline"></use>
                    </svg>
                </span>
                */}
                <span className="passengers-dropdown__icon">
                    <svg className={focusClassName()}>
                        <use xlinkHref="#kb_arrow-down"></use>
                    </svg>
                </span>
            </div>
            {active && (
                <div className="passengers-dropdown__container">
                    <PassengersDropdownForm value={value} setValue={setValue} />
                </div>
            )}
        </div>
    );
}
