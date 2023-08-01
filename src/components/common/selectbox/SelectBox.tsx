import { useRef, useState } from 'react';
import { TDictItem } from '../../../types';
import { useTranslation } from 'react-i18next';
import './selectbox.scss';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

export default function SelectBox({
    value,
    dict,
    label,
    placeholder,
    setValue,
    failed,
    disabled,
    className,
}: {
    dict: TDictItem[];
    value: string;
    label?: string;
    placeholder?: string;
    setValue?: (v: string) => void;
    failed?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    const selected = dict.find((i) => i.id == value);
    const [active, setActive] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [t] = useTranslation('common');

    useOnClickOutside(wrapperRef, () => setActive(false));

    const onSelect = function (item: TDictItem) {
        if (disabled) {
            return;
        }
        setActive(false);
        setValue && setValue(item.id);
    };

    const onActivate = function () {
        if (disabled) {
            return;
        }
        setActive(true);
        inputRef.current && inputRef.current.focus();
    };

    const onKeyDown = function (e: React.KeyboardEvent<HTMLElement>) {
        if (disabled) {
            return;
        }
        if (e.key === 'Enter') {
            if (!active) {
                return;
            }
            onSelect(dict[activeIndex]);
        } else if (e.key === 'ArrowUp') {
            if (!active) {
                setActive(true);
            }
            if (activeIndex === 0) {
                return;
            }
            setActiveIndex(() => activeIndex - 1);
        }
        // User pressed the down arrow, increment the index
        else if (e.key === 'ArrowDown') {
            if (!active) {
                setActive(true);
            }
            if (activeIndex + 1 === dict.length) {
                return;
            }
            setActiveIndex(() => activeIndex + 1);
        }
    };

    const hasIcon = selected && !!selected.icon;
    let inputClass = (active && !disabled ? ' active' : '') + (disabled ? ' disabled' : '');
    if (!inputClass && failed) {
        inputClass = ' failed';
    }
    return (
        <div className={'selectbox ' + className}>
            {label && <span className="selectbox__label">{label}</span>}
            <div
                role="combobox"
                aria-haspopup="listbox"
                aria-owns="react-autowhatever-1"
                aria-expanded="false"
                className="selectbox__combobox"
                ref={wrapperRef}
            >
                <div className={'selectbox__combobox__input ' + inputClass} onClick={onActivate}>
                    <div>
                        {hasIcon && (
                            <div className="selectbox__combobox__icon">
                                <img src={selected.icon} />
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            name="input"
                            placeholder={placeholder}
                            autoComplete="off"
                            className="styled__InnerInput-sc-yphlu2-0 kKfhuZ react-autosuggest__input"
                            readOnly={true}
                            onKeyDown={onKeyDown}
                            style={{ paddingLeft: hasIcon ? 0 : 12 }}
                            value={(selected && t(selected.shortTitle || selected.title)) || ''}
                            disabled={disabled}
                        />
                        <div className="selectbox__combobox__angle">
                            <span className="styled__IconWrapper-sc-o1jnik-1 laFhgJ">
                                <svg className="styled__IconSvg-sc-o1jnik-0 exmlQB" fill="colorTextPrimaryNormal" name="angle" rotate="">
                                    <use xlinkHref="#kb_angle"></use>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                {active && (
                    <div role="listbox" className="selectbox__container">
                        <ul>
                            {dict.map((item, i) => {
                                const isChecked = item.id == value;
                                const isActive = i === activeIndex;

                                return (
                                    <li
                                        key={item.id}
                                        role="option"
                                        aria-selected={isChecked}
                                        data-suggestion-index={i}
                                        onClick={() => onSelect(item)}
                                        className={isActive || isChecked ? 'selected' : ''}
                                    >
                                        <div>
                                            <div className="selectbox__item">
                                                {item.icon && <img src={item.icon} className="selectbox__item__icon" />}
                                                <span className="selectbox__item__title">{t(item.title)}</span>
                                                {item.symbol && (
                                                    <span className="selectbox__item__symbol">
                                                        <span>{item.symbol}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="selectbox__item__check">
                                                {isChecked && (
                                                    <svg name="checkmark" rotate="">
                                                        <use xlinkHref="#kb_checkmark"></use>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
