import { useEffect, useState } from 'react';
import AirportSuggest from '../airport-suggest/AirportSuggest';
import DateInput from '../date-input/DateInput';
import { PassengersDropdown } from '../passengers-dropdown/PassengersDropdown';
import { TAirport, TPassengers, TSearchFilter, TSelected, TTicket } from '../../types';
import TicketsList from './TicketsList';
import { factorySearchFilter } from '../../domain/SearchFilter';
import { useTranslation } from 'react-i18next';
import { clearBook, factoryBook } from '../../domain/Book';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/loading/Loading';

export default function Home() {
    const [t] = useTranslation('common');
    const searchFilter = factorySearchFilter();

    const [filterDeparture, setFilterDeparture] = useState<TAirport | undefined>(searchFilter.departure);
    const [filterArrival, setFilterArrival] = useState<TAirport | undefined>(searchFilter.arrival);
    const [filterFromDate, setFilterFromDate] = useState<string>(searchFilter.fromDate);
    const [filterToDate, setFilterToDate] = useState<string>(searchFilter.toDate);
    const [filterPassengers, setFilterPassengers] = useState<TPassengers>({ cabin: searchFilter.cabin, travelers: searchFilter.travelers });
    const [filter, setFilter] = useState<TSearchFilter | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const nav = useNavigate();

    const swapAirports = function () {
        const tmp = filterDeparture;
        setFilterDeparture(filterArrival);
        searchFilter.departure = filterArrival ? filterArrival : undefined;
        setFilterArrival(tmp);
        searchFilter.arrival = tmp ? tmp : undefined;
        search();
    };

    const search = function () {
        let filter: TSearchFilter | undefined;
        if (searchFilter.departure && searchFilter.arrival && searchFilter.fromDate) {
            filter = searchFilter.getFilter();
            // @ts-ignore
            filter.rnd = Math.floor(Math.random() * 1000);
        }
        setFilter(filter);
    };

    const changeFilterDeparture = function (v: TAirport) {
        searchFilter.departure = v;
        setFilterDeparture(v);
    };

    const changeFilterArrival = function (v: TAirport) {
        searchFilter.arrival = v;
        setFilterArrival(v);
        search();
    };

    const changeFilterDateRange = function (from: string, to: string) {
        searchFilter.fromDate = from;
        searchFilter.toDate = to;
        setFilterFromDate(from);
        setFilterToDate(to);
    };

    const changeFilterPassengers = function (v: TPassengers) {
        searchFilter.travelers = v.travelers;
        searchFilter.cabin = v.cabin;
        setFilterPassengers(v);
    };

    const onBook = function (ticket: TTicket) {
        const book = factoryBook();
        book.ticket = ticket;
        book.travelers = searchFilter.travelers;
        setLoading(true);
        book.loadCities().then(() => {
            nav('/book', { replace: false });
        });
    };

    useEffect(() => {
        if (filterDeparture && filterArrival && filterFromDate) {
            // search();
        }
        clearBook();
    }, []);

    return (
        <main className="homepage">
            <section className="homepage__search">
                <div className="homepage__filter">
                    <div className="homepage__filter__container">
                        <div className="homepage__filter__form">
                            <div className="homepage__airport-select-group">
                                <AirportSuggest label={t('search.from')} value={filterDeparture} setValue={changeFilterDeparture} />
                                <div className="homepage__swap-button">
                                    <div onClick={swapAirports}>
                                        <span>
                                            <svg>
                                                <use xlinkHref="#kb_swap-long"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <AirportSuggest label={t('search.to')} value={filterArrival} setValue={changeFilterArrival} />
                            </div>
                            <div className="homepage__other-group">
                                <div className="homepage__date-group">
                                    <DateInput from={filterFromDate} to={filterToDate} setValue={changeFilterDateRange} />
                                </div>
                                <div className="homepage__passengers-group">
                                    <PassengersDropdown value={filterPassengers} setValue={changeFilterPassengers} />
                                </div>
                                <button className="homepage__search-button" onClick={() => search()}>
                                    <span className="homepage__search-button__text">{t('search.submit')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="homepage__options"></div>
                <div className="">{(loading && <Loading />) || <TicketsList filter={filter} onBook={onBook}></TicketsList>}</div>
            </section>
        </main>
    );
}
