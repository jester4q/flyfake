import { useState } from 'react';
import SelectBox from '../common/selectbox/SelectBox';
import './lang-currency-form.scss';
import { CURRENCIS, LANGUAGES } from '../../data/dict';
import { TCurrency, TLanguage, TLngCurPair } from '../../types';
import { useTranslation } from 'react-i18next';

export default function LandAndCurrencyForm({ value, onSubmit, onClose }: { value: TLngCurPair; onSubmit: (val: TLngCurPair) => void; onClose: () => void }) {
    const [lng, setLng] = useState<TLanguage>(value.language);
    const [cur, setCur] = useState<TCurrency>(value.currency);

    const [t] = useTranslation('common');

    return (
        <div className="lang-currency-form">
            <div>
                <div>
                    <h1>Language and currency</h1>
                    <SelectBox label={'Language'} value={lng} dict={LANGUAGES} setValue={(v: string) => setLng(v as TLanguage)} />
                    <SelectBox label={'Currency'} value={cur} dict={CURRENCIS} setValue={(v: string) => setCur(v as TCurrency)} />
                    <div className="lang-currency-form__ctrls">
                        <button
                            className=""
                            onClick={() => {
                                onSubmit({ language: lng, currency: cur });
                            }}
                        >
                            <span>{t('form.apply')}</span>
                        </button>
                        <button className="secondary" onClick={onClose}>
                            <span>{t('form.cancel')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
