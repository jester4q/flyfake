import { useRef, useState } from 'react';
import LandAndCurrencyForm from './LangAndCurrencyForm';
import './lang-currency.scss';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { factorySearchFilter } from '../../domain/SearchFilter';
import { CURRENCIS, LANGUAGES } from '../../data/dict';
import { TCurrency, TLanguage, TLngCurPair } from '../../types';
import { useTranslation } from 'react-i18next';

export default function LangAndCurrency({ value, onChange }: { value: TLngCurPair; onChange: (value: TLngCurPair) => void }) {
    const [active, setActive] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(wrapperRef, () => setActive(false));

    const selectedLng = LANGUAGES.find((item) => item.id === value.language);
    const selectedCur = CURRENCIS.find((item) => item.id === value.currency);

    const save = (val: TLngCurPair) => {
        setActive(false);
        onChange(val);
    };

    const [t] = useTranslation('common');

    return (
        <div style={{ position: 'relative' }} ref={wrapperRef}>
            <div className="lang-currency" onClick={() => setActive(!active)}>
                <span className="">
                    {t(selectedLng!.title)} • {t(selectedCur!.shortTitle)}
                </span>
            </div>
            {active && <LandAndCurrencyForm onClose={() => setActive(false)} onSubmit={save} value={value} />}
        </div>
    );
}
