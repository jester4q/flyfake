import moment from 'moment';

import { TTicket, TTrip, TTripDetailed } from '../../types';
import TicketTrip from './TicketTrip';
import './ticket.scss';
import { useState } from 'react';
import TicketDetailedTrip from './TicketDetailedTrip';
import { useTranslation } from 'react-i18next';
import Price from '../common/price/Price';
import { formatDate } from '../../utils/farmatDate';

function getTrips(data: TTicket): TTrip[] {
    const trips: TTrip[] = [];

    for (let i = 0; i < data.list.length; i++) {
        let item = data.list[i];
        const trip: TTrip = {
            depatureTime: formatDate(item.depatureTime, 'HH:mm'),
            depatureDate: formatDate(item.depatureTime, 'ddd, D MMMM'),
            depatureAirportName: item.depatureAirportName,
            depatureAirportCode: item.depatureAirportCode,
            arrivalTime: formatDate(item.arrivalTime, 'HH:mm'),
            arrivalDate: formatDate(item.arrivalTime, 'ddd, D MMMM'),
            arrivalAirportName: item.arrivalAirportName,
            arrivalAirportCode: item.arrivalAirportCode,
            path: [{ code: '', duration: item.duration }],
            duration: item.duration,
            flightDuration: item.duration,
            stops: 0,
            flyghtNumber: item.flyNumber,
            transport: item.transport,
        };
        while (item && item.transferDuration) {
            trip.path.push({
                code: item.arrivalAirportCode,
                duration: item.transferDuration,
            });
            trip.duration += item.transferDuration;
            trip.stops++;
            i++;
            item = data.list[i];
            if (item) {
                trip.arrivalAirportCode = item.arrivalAirportCode;
                trip.arrivalAirportName = item.arrivalAirportName;
                trip.arrivalDate = formatDate(item.arrivalTime, 'ddd, D MMMM');
                trip.arrivalTime = formatDate(item.arrivalTime, 'HH:mm');
                trip.path.push({
                    code: '',
                    duration: item.duration,
                });
                trip.duration += item.duration;
                trip.flightDuration += item.duration;
            }
        }
        trips.push(trip);
    }

    return trips;
}

function getDetailedTrips(data: TTicket): TTripDetailed[] {
    const trips: TTripDetailed[] = [];
    for (let i = 0; i < data.list.length; i++) {
        let item = data.list[i];
        const trip: TTripDetailed = {
            fromCity: item.depatureCity,
            toCity: item.arrivalCity,
            path: [
                {
                    depatureCity: item.depatureCity,
                    arrivalCity: item.arrivalCity,
                    depatureTime: formatDate(item.depatureTime, 'HH:mm'),
                    depatureDate: formatDate(item.depatureTime, 'ddd, D MMMM'),
                    depatureAirportName: item.depatureAirportName,
                    depatureAirportCode: item.depatureAirportCode,
                    arrivalTime: formatDate(item.arrivalTime, 'HH:mm'),
                    arrivalDate: formatDate(item.arrivalTime, 'ddd, D MMMM'),
                    arrivalAirportName: item.arrivalAirportName,
                    arrivalAirportCode: item.arrivalAirportCode,
                    airline: item.airline,
                    flyghtNumber: item.flyNumber,
                    transport: item.transport,
                    transfer: item.transferDuration,
                    duration: item.duration,
                },
            ],
        };

        while (item && item.transferDuration) {
            i++;
            item = data.list[i];
            if (item) {
                trip.toCity = item.arrivalCity;
                trip.path.push({
                    depatureCity: item.depatureCity,
                    arrivalCity: item.arrivalCity,
                    depatureTime: formatDate(item.depatureTime, 'HH:mm'),
                    depatureDate: formatDate(item.depatureTime, 'ddd, D MMMM'),
                    depatureAirportName: item.depatureAirportName,
                    depatureAirportCode: item.depatureAirportCode,
                    arrivalTime: formatDate(item.arrivalTime, 'HH:mm'),
                    arrivalDate: formatDate(item.arrivalTime, 'ddd, D MMMM'),
                    arrivalAirportName: item.arrivalAirportName,
                    arrivalAirportCode: item.arrivalAirportCode,
                    airline: item.airline,
                    flyghtNumber: item.flyNumber,
                    transport: item.transport,
                    transfer: item.transferDuration,
                    duration: item.duration,
                });
            }
        }
        trips.push(trip);
    }

    return trips;
}

export default function Ticket({ data, onSelect }: { data: TTicket; onSelect?: () => void }) {
    const [t, i18nConfig] = useTranslation('common');
    const lng = i18nConfig.language;
    moment.locale(lng);
    const [detailed, setDetailed] = useState<boolean>(false);
    const trips = detailed ? getDetailedTrips(data) : getTrips(data);

    const showDetails = function () {
        setDetailed(true);
    };

    const hideDetails = function () {
        setDetailed(false);
    };

    const avialines = data.list.reduce<string[]>((a, i) => {
        if (!a.includes(i.airline)) {
            a.push(i.airline);
        }
        return a;
    }, []);

    return (
        <div className="ticket">
            <div className="ticket__container">
                <div className="ticket__body">
                    <div className="ticket__body__content">
                        <div className="ticket__airlines">
                            <div className="ticket__airlines__list">
                                {avialines.map((al, i) => (
                                    <div className="ticket__airlines__item">
                                        <div>
                                            <span key={i}>{al + (i !== avialines.length - 1 ? ',' : '')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ticket__labels">
                                {data.cheapest && (
                                    <div className="ticket__tag">
                                        <div className="styled__MessageBox-sc-h486ra-3 doZhkR">{t('ticket.cheapest')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {(detailed && (
                            <div className="ticket__detailed-trips">
                                {(trips as TTripDetailed[]).map((item, i) => {
                                    const last = i === trips.length - 1;
                                    return (
                                        <>
                                            <TicketDetailedTrip key={i} data={item} />
                                            {!last && <div key={'divider-' + i} className="ticket__trips__divider"></div>}
                                        </>
                                    );
                                })}
                            </div>
                        )) || (
                            <div className="ticket__trips">
                                {(trips as TTrip[]).map((item, i) => (
                                    <TicketTrip key={i} data={item} />
                                ))}
                            </div>
                        )}
                        <div className="ticket__ctrls">
                            {(detailed && (
                                <button onClick={() => hideDetails()}>
                                    <span className="ticket__ctrls__title">{t('ticket.hide_details')}</span>
                                    <span className="ticket__ctrls__icon">
                                        <span>
                                            <svg name="arrow-up" rotate="">
                                                <use xlinkHref="#kb_arrow-up"></use>
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                            )) || (
                                <button onClick={() => showDetails()}>
                                    <span className="ticket__ctrls__title">{t('ticket.show_details')}</span>
                                    <span className="ticket__ctrls__icon">
                                        <span className="styled__IconWrapper-sc-o1jnik-1 laFhgJ">
                                            <svg name="arrow-down" rotate="">
                                                <use xlinkHref="#kb_arrow-down"></use>
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="ticket__devider"></div>
                <div className="ticket__sidebar">
                    <div>
                        <div className="ticket__sidebar__price">
                            <h1>
                                <Price price={data.price} />
                            </h1>
                        </div>
                        <span className="ticket__sidebar__price-description">{t('ticket.for_all')}</span>

                        <div className="ticket__sidebar__submit">
                            <button className="action" onClick={() => onSelect && onSelect()}>
                                <span>{t('ticket.book')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
