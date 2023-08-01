import { useRef, useState } from 'react';
import './suggest.scss';
import { TAirport, TCityAirports, TSelected } from '../../types';
import AirportSuggestInput from './AirportSuggestInput';
import AirportSuggestDropDown from './AirportSuggestDropDown';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useOnFetch from '../../hooks/useOnFetch';
import { factorySearchFilter } from '../../domain/SearchFilter';

export default function AirportSuggest({ value, setValue, label }: { label: string; value?: TAirport; setValue: (v: TAirport) => void }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [userInput, setUserInput] = useState<string>(value?.city || '');
    const [selected, setSelected] = useState<TAirport | null>(value || null);

    useOnClickOutside(wrapperRef, () => setActive(false));

    const onChage = function (e: React.ChangeEvent<HTMLInputElement>) {
        const userInput: string = e.currentTarget.value;
        setUserInput(userInput);
        setActive(true);
    };

    const onSelect = function (i: TAirport) {
        setActiveIndex(0);
        setActive(false);
        setUserInput(i.city);
        setSelected(i);
        setValue(i);
    };

    const onAvtivete = function () {
        setActive(true);
    };

    const query = userInput || value?.city || '';
    const lng: 'en' | 'ru' = factorySearchFilter().language.toLowerCase() as unknown as 'en' | 'ru';

    const url = query && `/airport/search?str=${query}`;
    const { status, data } = useOnFetch<TCityAirports>(url);
    url.toLowerCase;
    const airports: TAirport[] = [];
    data?.forEach((item) => {
        item.airports.forEach((port, i) => {
            airports.push({
                city: item.name[lng],
                country: item.country[lng],
                airport: port.name[lng],
                airportCode: port.code,
                cityCode: item.code,
                isCity: i == 0,
                code: i == 0 ? item.code : port.code,
                name: i == 0 ? item.name[lng] : port.name[lng],
                isOne: item.airports.length == 1,
            });
            if (i == 0 && item.airports.length > 1) {
                airports.push({
                    city: item.name[lng],
                    country: item.country[lng],
                    airport: port.name[lng],
                    airportCode: port.code,
                    cityCode: item.code,
                    isCity: false,
                    code: port.code,
                    name: port.name[lng],
                    isOne: false,
                });
            }
        });
    });

    const onKeyDown = function (e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            if (!active) {
                return;
            }
            onSelect(airports[activeIndex]);
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
            if (activeIndex + 1 === airports.length) {
                return;
            }
            setActiveIndex(() => activeIndex + 1);
        }
    };

    return (
        <div className="airportsuggest" onClick={onAvtivete} ref={wrapperRef}>
            <AirportSuggestInput label={label} active={active} value={userInput} code={value?.code} onKeyDown={onKeyDown} onChange={onChage} />
            {active && <AirportSuggestDropDown value={value} list={airports} activeIndex={activeIndex} onSelect={onSelect} />}
        </div>
    );
}
