import { TTrip } from '../../types';
import DHM from '../common/dhm/DHM';
import './ticket-trip.scss';
import { useTranslation } from 'react-i18next';

const colors: string[] = ['#cd202c', '#b3d643', '#203484'];

export default function TicketTrip({ data }: { data: TTrip }) {
    const [t] = useTranslation('common');

    const stops = data.stops
        ? `${data.stops} ` + (data.stops > 1 ? t('ticket.stops') : t('ticket.stop'))
        : t('ticket.direct') + `, ${data.flyghtNumber}, ${data.transport}`;

    return (
        <div className="">
            <div className="ticket__trip-container">
                <span className="ticket__trip-time">{data.depatureTime}</span>
                <div className="ticket__trip-timeline">
                    <div className="">
                        <div className="">
                            {data.path.map(
                                (item, i) =>
                                    (item.code && (
                                        <div key={i} className="" style={{ flexGrow: item.duration }}>
                                            <div className="ticket__trip-transfrer">
                                                <span className="">
                                                    <span color="colorTextDescriptionNormal" className="">
                                                        {item.code}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    )) || (
                                        <div key={i} className="" style={{ flexGrow: item.duration }}>
                                            <div style={{ background: colors[i % colors.length] }} className="ticket__trip-flight"></div>
                                        </div>
                                    ),
                            )}
                        </div>
                    </div>
                </div>
                <span className="ticket__trip-time">{data.arrivalTime}</span>

                <div className="ticket__trip-departure ">
                    <div>
                        <span className="">{data.depatureDate}</span>
                        <br />
                        {data.depatureAirportName} ({data.depatureAirportCode})
                    </div>
                </div>
                <div className="ticket__trip-arrival">
                    <div>
                        <span style={{ color: '#ff6240' }}>{data.arrivalDate}</span>
                        <br />
                        {data.arrivalAirportName} ({data.arrivalAirportCode})
                    </div>
                </div>
            </div>
            <div className="ticket__trip-summary">
                <div className="ticket__trip-duration">
                    <div className="">
                        <h3>
                            <DHM value={data.flightDuration} />
                        </h3>
                    </div>
                </div>
                <div className="ticket__trip-info">
                    <div>
                        <div>
                            {stops}, <DHM value={data.duration} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
