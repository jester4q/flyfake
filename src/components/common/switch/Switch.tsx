import { useTranslation } from 'react-i18next';
import { TDictItem } from '../../../types';
import './switch.scss';

export default function Switch({
    value,
    dict,
    label,
    setValue,
    failed,
}: {
    value: string;
    dict: TDictItem[];
    label?: string;
    setValue?: (v: string) => void;
    failed: boolean;
}) {
    const [t] = useTranslation('common');
    return (
        <div className={'switch' + (failed ? ' failed' : '')}>
            <div>
                {label && <span className="switch__label">{label}</span>}
                <div className="switch__container">
                    <div className="switch__items">
                        {dict.map((i, k) => {
                            const active = i.id == value;
                            return (
                                <div key={k} onClick={() => setValue && setValue(i.id)}>
                                    <input type="radio" value={i.id} />
                                    <div className={'switch__toggler ' + ((active && 'switch__toggler_active') || '')}>{t(i.title)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
