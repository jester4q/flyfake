import './amount-input.scss';

export default function AmountInput({ value, setValue, min, max }: { value: number; min?: number; max?: number; setValue: (v: number) => void }) {
    const onInc = () => {
        if (canInc()) {
            setValue(value + 1);
        }
    };

    const onDec = () => {
        if (canDec()) {
            setValue(value - 1);
        }
    };

    const canDec = () => {
        const v = value - 1;
        return v >= 0 && (min === undefined || v >= min);
    };

    const canInc = () => {
        const v = value + 1;
        return max === undefined || v <= max;
    };

    return (
        <div className="amount-input">
            <div className="">
                <button className="amount-input__button" onClick={onDec} disabled={!canDec()}>
                    <span className="">
                        <span className="">
                            <svg className="" name="minus" rotate="">
                                <use xlinkHref="#kb_minus"></use>
                            </svg>
                        </span>
                    </span>
                </button>
                <div className="amount-input__value">{value}</div>
                <button className="amount-input__button" onClick={onInc} disabled={!canInc()}>
                    <span className="">
                        <span className="">
                            <svg className="" name="plus" rotate="">
                                <use xlinkHref="#kb_plus"></use>
                            </svg>
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
}
