import { useEffect, useRef } from 'react';
import { TAirport } from '../../types';

export default function AirportSuggestDropDown({
    list,
    value,
    activeIndex,
    onSelect,
}: {
    list: TAirport[];
    value?: TAirport;
    activeIndex: number;
    onSelect: (v: TAirport) => void;
}) {
    if (!list.length) {
        return <></>;
    }

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const section: HTMLDivElement = ref.current.firstElementChild?.children[activeIndex] as HTMLDivElement;
            if (section) {
                const topPos = section.offsetTop;
                ref.current.scrollTop = topPos;
            }
        }
    }, [activeIndex]);

    return (
        <div className="airportsuggest__list " ref={ref}>
            <ul className="suggestions" onClick={(e) => e.stopPropagation()}>
                {list.map((suggestion, index) => {
                    const isActive: boolean = index == activeIndex;
                    const isChecked: boolean = value?.code == suggestion.cityCode || value?.code == suggestion.airportCode;

                    return (
                        <>
                            {suggestion.isCity && (
                                <li
                                    key={'suggestion-city-' + index}
                                    aria-selected={isActive}
                                    aria-level={1}
                                    data-suggestion-index={index}
                                    onClick={() => onSelect(suggestion)}
                                    className={isActive || isChecked ? 'selected' : ''}
                                >
                                    <div className="airportsuggest__listblock airportsuggest__listblock_city">
                                        <div className="airportsuggest__icon">
                                            <span className="airportsuggest__icon-wrapper">
                                                <svg className="" fill="colorTextPrimaryNormal" name="city" rotate="">
                                                    <use xlinkHref="#kb_city"></use>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="airportsuggest__location">
                                            <div className="airportsuggest__location-title">
                                                <span className="text">{suggestion.city}</span>
                                                <div className="airportsuggest__location-iata">
                                                    <span className="text">{suggestion.cityCode}</span>
                                                    {isChecked && (
                                                        <span className="airportsuggest__icon-wrapper">
                                                            <svg className="" name="checkmark" rotate="">
                                                                <use xlinkHref="#kb_checkmark"></use>
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="airportsuggest__location-sub">
                                                {(suggestion.isOne ? 'airport ' + suggestion.airport + ', ' : '') + suggestion.country}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                            {!suggestion.isCity && (
                                <li
                                    key={'suggestion-airport-' + index}
                                    aria-selected={isActive}
                                    data-suggestion-index={index}
                                    onClick={() => onSelect(suggestion)}
                                    className={isActive || isChecked ? 'selected' : ''}
                                >
                                    <div className="airportsuggest__listblock">
                                        <div className="airportsuggest__icon">
                                            <span className="airportsuggest__icon-wrapper">
                                                <svg className="" name="city" rotate="">
                                                    <use xlinkHref="#kb_plane"></use>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="airportsuggest__location">
                                            <div className="airportsuggest__location-title">
                                                <span className="text">{suggestion.airport}</span>
                                                <div className="airportsuggest__location-iata">
                                                    <span className="text">{suggestion.airportCode}</span>
                                                    <span className="airportsuggest__icon-wrapper airportsuggest__mark">
                                                        {isChecked && (
                                                            <svg className="" name="checkmark" rotate="">
                                                                <use xlinkHref="#kb_checkmark"></use>
                                                            </svg>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="airportsuggest__location-sub"></div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </>
                    );
                })}
            </ul>
        </div>
    );
}
