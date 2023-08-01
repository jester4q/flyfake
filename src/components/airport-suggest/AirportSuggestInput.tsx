import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { TCityAirports } from '../../types';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    code?: string;
    active: boolean;
    label: string;
}

export default function AirportSuggestInput({ value, code, active, label, onKeyDown, onChange, onFocus }: InputProps) {
    const [focused, setFocused] = useState<boolean>();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFocused(active);
        if (inputRef && active) {
            inputRef.current && inputRef.current.focus();
        }
    }, [active]);

    const onFocusInput = function (e: React.FocusEvent<HTMLInputElement>) {
        setFocused(true);
        onFocus && onFocus(e);
    };

    const onBlurInput = function (_e: React.FocusEvent<HTMLInputElement>) {
        //setFocused(false);
        //onBlur && onBlur(e);
    };

    const focusClassName = function () {
        return focused ? ' focused' : '';
    };

    const focusedInputClassName = function () {
        return (value && value.length) || focused ? ' focused' : '';
    };

    const hasCode = !!code;

    return (
        <div className="airportsuggestinput">
            <div className={'airportsuggestinput__container'}>
                <div className={'airportsuggestinput__inner-wrapper' + focusClassName()}>
                    <div className="airportsuggestinput__placeholder">
                        <div className={'airportsuggestinput__placeholder__text' + focusedInputClassName()}>{label}</div>
                        <div className="airportsuggestinput__content">
                            <input
                                onKeyDown={onKeyDown}
                                onChange={onChange}
                                ref={inputRef}
                                type="text"
                                autoComplete="off"
                                value={value || ''}
                                className={focusClassName()}
                                onFocus={onFocusInput}
                                onBlur={onBlurInput}
                            />
                            <div className="" style={{ visibility: hasCode ? 'visible' : 'hidden' }}>
                                {code || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
