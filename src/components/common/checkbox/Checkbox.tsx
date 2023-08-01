import './checkbox.scss';

export default function Checkbox({ value, label, setValue }: { value: boolean; label: string; setValue: (v: boolean) => void }) {
    const onChange = () => {
        setValue && setValue(!value);
    };

    return (
        <div className={'checkbox ' + (value ? 'checkbox_checked' : '')}>
            <label className="">
                <span className="checkbox__input">
                    {value && (
                        <span className="">
                            <span className="styled__IconWrapper-sc-o1jnik-1 laFhgJ">
                                <svg className="styled__IconSvg-sc-o1jnik-0 djIHIm" fill="colorBgPrimaryNormal" name="checkbox-check" rotate="">
                                    <use xlinkHref="#kb_checkbox-check"></use>
                                </svg>
                            </span>
                        </span>
                    )}
                    <input name="" type="checkbox" checked={value} onChange={onChange} />
                </span>
                <span className="checkbox__label">{label}</span>
            </label>
        </div>
    );
}
