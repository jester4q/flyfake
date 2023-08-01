import AmountInput from '../common/amount-input/AmountInput';
import Checkbox from '../common/checkbox/Checkbox';
import { TPassengers } from '../../types';
import { useTranslation } from 'react-i18next';

export default function PassengersDropdownForm({ value, setValue }: { value: TPassengers; setValue: (v: TPassengers) => void }) {
    const [t] = useTranslation('common');

    const toBusiness = (v: boolean) => {
        setValue({ cabin: v ? 'business' : 'economy', travelers: { ...value.travelers } });
    };

    const setAdult = (v: number) => {
        setValue({ cabin: value.cabin, travelers: { ...value.travelers, adult: v } });
    };

    const setChild = (v: number) => {
        setValue({ cabin: value.cabin, travelers: { ...value.travelers, child: v } });
    };

    const setInfant = (v: number) => {
        setValue({ cabin: value.cabin, travelers: { ...value.travelers, infant: v } });
    };

    return (
        <div className="passengers-dropdown__form">
            <h1>
                {value.travelers.infant + value.travelers.child + value.travelers.adult} {t('search.passenger')}
            </h1>
            <div className="passengers-dropdown__form-line">
                <div className="passengers-dropdown__form-label">
                    <div>{t('search.adults')}</div>
                    <div>{t('search.adults_desc')}</div>
                </div>

                <AmountInput value={value.travelers.adult} setValue={setAdult} min={1} max={9 - value.travelers.infant - value.travelers.child} />
            </div>
            <div className="passengers-dropdown__form-line">
                <div className="passengers-dropdown__form-label">
                    <div>{t('search.children')}</div>
                    <div>{t('search.children_desc')}</div>
                </div>
                <AmountInput value={value.travelers.child} setValue={setChild} min={0} max={9 - value.travelers.adult - value.travelers.infant} />
            </div>
            <div className="passengers-dropdown__form-line">
                <div className="passengers-dropdown__form-label">
                    <div>{t('search.infants')}</div>
                    <div>{t('search.infants_desc')}</div>
                </div>
                <AmountInput
                    value={value.travelers.infant}
                    setValue={setInfant}
                    min={0}
                    max={Math.min(value.travelers.adult, 9 - value.travelers.adult - value.travelers.child)}
                />
            </div>
            <div className="passengers-dropdown__form-divider"></div>
            <Checkbox value={value.cabin == 'business'} label={t('search.business_class')} setValue={toBusiness} />
        </div>
    );
}
