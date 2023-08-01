import './ticket-detailed-trip.scss';
import { TTripDetailed } from '../../types';
import DHM from '../common/dhm/DHM';
import { useTranslation } from 'react-i18next';

export default function TicketDetailedTrip({ data }: { data: TTripDetailed }) {
    const [t] = useTranslation('common');
    return (
        <div className="ticket-detailed-trip">
            <div className="ticket-detailed-trip__header">
                <h1>
                    {data.fromCity} — {data.toCity}
                </h1>
                <span>{t('ticket.desc')}</span>
            </div>
            {data.path.map((item, i) => {
                return (
                    <>
                        <div key={i} className="ticket-detailed-trip__container">
                            <div className="ticket-detailed-trip__journey">
                                <div className="ticket-detailed-trip__departure-time">
                                    <span>{item.depatureTime}</span>
                                </div>
                                <div className="ticket-detailed-trip__line">
                                    <span className="ticket-detailed-trip__airline">{item.airline}</span>
                                    <span className="ticket-detailed-trip__airline-icon">
                                        <svg name="plane" rotate="true">
                                            <use xlinkHref="#kb_plane"></use>
                                        </svg>
                                    </span>
                                    <div className="ticket-detailed-trip__flight"></div>
                                </div>
                                <div className="ticket-detailed-trip__arrival-time">
                                    <span>{item.arrivalTime}</span>
                                </div>
                                <div className="ticket-detailed-trip__departure-info">
                                    <span>{item.depatureDate}</span>
                                    <span>{item.depatureCity}</span>
                                    <span>
                                        {item.depatureAirportName} ({item.depatureAirportCode})
                                    </span>
                                </div>
                                <div className="ticket-detailed-trip__arrival-info">
                                    <span>{item.arrivalDate}</span>
                                    <span>{item.arrivalCity}</span>
                                    <span>
                                        {item.arrivalAirportName} ({item.arrivalAirportCode})
                                    </span>
                                </div>
                            </div>
                            <div className="ticket-detailed-trip__duration">
                                <span className="ticket-detailed-trip__duration-time">
                                    <DHM value={item.duration} />
                                </span>
                                <span>Flight {item.flyghtNumber}</span>
                                <span>{item.transport}</span>
                            </div>
                        </div>
                        {item.transfer && (
                            <div key={'transfer-' + i} className="ticket-detailed-trip__transfer">
                                <h1>{t('ticket.transfer_in')}</h1>
                                <DHM value={item.transfer} />
                            </div>
                        )}
                    </>
                );
            })}
        </div>
    );
}
