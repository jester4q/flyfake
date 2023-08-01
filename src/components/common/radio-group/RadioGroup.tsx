import { useTranslation } from 'react-i18next';
import { TDictItem, TPrice } from '../../../types';
import './radio-group.scss';
import Price from '../price/Price';

export type TOptionItem = {
    id: string;
    title: string;
    price: TPrice;
};

export default function RadioGroup({ value, dict, setValue }: { value: string; dict: TOptionItem[]; setValue?: (v: string) => void }) {
    const [t] = useTranslation('common');
    const setActive = (id: string) => {
        setValue && setValue(id);
    };
    return (
        <div className="radio-group">
            {dict.map((item, i) => {
                const isActive = item.id == value;
                return (
                    <div key={i} className={'radio-group__item ' + (isActive ? 'active' : '')} onClick={() => setActive(item.id)}>
                        <div className="radio-group__leftpart">
                            <label>
                                <div className="radio-group__button"></div>
                                <input type="radio" value="base" />
                            </label>

                            <span>{t(item.title)}</span>
                        </div>
                        <span className="radio-group__rightpart">
                            <Price price={item.price} />
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
