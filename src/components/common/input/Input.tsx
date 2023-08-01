import { ChangeEvent, useState } from 'react';
import './input.scss';

export default function Input({
    value,
    setValue,
    label,
    placeholder,
    failed,
}: {
    value: string;
    setValue?: (v: string) => void;
    label?: string;
    placeholder?: string;
    failed?: boolean;
}) {
    const [focused, setFocused] = useState<boolean>(false);
    const handleChange = function (event: ChangeEvent<HTMLInputElement>) {
        setValue && setValue(event.target.value);
    };
    const onFocusInput = function (_e: React.FocusEvent<HTMLInputElement>) {
        setFocused(true);
    };

    const onBlurInput = function (_e: React.FocusEvent<HTMLInputElement>) {
        setFocused(false);
    };

    const focusClassName = (): string => {
        if (focused) {
            return ' active';
        }
        if (failed) {
            return ' failed';
        }
        return '';
    };
    return (
        <div className="input">
            {label && <span className="input__label">{label}</span>}
            <div className={'input__container' + focusClassName()}>
                <div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        autoComplete="no"
                        value={value}
                        onChange={handleChange}
                        className={focusClassName()}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                    />
                </div>
            </div>
        </div>
    );
}
