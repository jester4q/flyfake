import moment from 'moment';
import 'moment/locale/ru';
import { TTicket, TTripDetailed } from '../../types';
import './ticket-details.scss';
import { useState } from 'react';
import TicketDetailedTrip from './TicketDetailedTrip';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/farmatDate';

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

export default function TicketDetails({ data }: { data: TTicket }) {
    const [t, i18nConfig] = useTranslation('common');
    const lng = i18nConfig.language;
    moment.locale(lng);
    // const [detailed, setDetailed] = useState<boolean>(false);
    const trips = getDetailedTrips(data);

    return (
        <div className="ticket-details">
            <section>
                <div className="ticket-details__header">
                    <div>
                        <h1>{t('booking.details_title')}</h1>
                        <sub>{t('booking.details_note')}</sub>
                    </div>
                </div>
            </section>
            <section>
                <div className="ticket-details__container">
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
                </div>
            </section>
        </div>
    );
}
