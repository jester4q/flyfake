import './print.scss';
import { useTranslation } from 'react-i18next';
import { TicketPrinter } from '../../printer/ticket.printer';
import { Link } from '../common/link';
import { factoryBook } from '../../domain/Book';
import moment from 'moment';
import DHMOnBothLng from '../common/dhm/DHMOnBothLng';
import Price from '../common/price/Price';
import { formatDate } from '../../utils/farmatDate';

export default function Print() {
    const [t] = useTranslation('common');
    const download = () => {
        const printer = new TicketPrinter();
        printer.generatePDF();
    };

    const book = factoryBook();
    const path = book.path;
    const cityDict = book.cities;
    const fromCity = cityDict[path.fromCity];
    const toCity = cityDict[path.toCity];

    return (
        <main className="print">
            <section className="print__heading">
                <div className="breadcrumbs">
                    <div>
                        <div className="backlink">
                            <Link to="/">
                                <button>
                                    <span className="breadcrumbs__icon">
                                        <span>
                                            <svg name="arrow-left" rotate="">
                                                <use xlinkHref="#kb_arrow-left"></use>
                                            </svg>
                                        </span>
                                    </span>
                                    <span className="breadcrumbs__text">{t('booking.back_to_search')}</span>
                                </button>
                            </Link>
                        </div>
                        <div className="breadcrumbs__wrap">
                            <button>
                                <span className="breadcrumbs__icon">
                                    <span>
                                        <svg name="calendar" rotate="">
                                            <use xlinkHref="#kb_calendar"></use>
                                        </svg>
                                    </span>
                                </span>
                                <span className="breadcrumbs__text">{t('booking.step1')}</span>
                            </button>
                            <div>
                                <div></div>
                            </div>
                            <button>
                                <span className="breadcrumbs__icon">
                                    <span>
                                        <svg name="coins" rotate="">
                                            <use xlinkHref="#kb_coins"></use>
                                        </svg>
                                    </span>
                                </span>
                                <span className="breadcrumbs__text">{t('booking.step2')}</span>
                            </button>
                            <div>
                                <div></div>
                            </div>
                            <button className="active">
                                <span className="breadcrumbs__icon">
                                    <span>
                                        <svg name="ticket_horizontal" rotate="">
                                            <use xlinkHref="#kb_ticket_horizontal"></use>
                                        </svg>
                                    </span>
                                </span>
                                <span className="breadcrumbs__text">{t('booking.step3')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="print__details">
                <div className="print__warp">
                    <div>
                        <div className="ticket-paper">
                            {/*
                            <div className="ticket-paper__logo">
                                <img src="img/logo.png"></img>
                            </div>
                            */}
                            <div className="ticket-paper__header">Itinerary receipt / Маршрутная квитанция</div>
                            <div className="ticket-paper__booking">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Reservation date / Дата бронирования:</td>
                                            <td>{moment(book.bookDate).format('DD.MM.YYYY HH:mm')}</td>
                                        </tr>
                                        <tr>
                                            <td>Reservation code / Код бронирования:</td>
                                            <td>{book.bookCode}</td>
                                        </tr>
                                        <tr>
                                            <td>Status / Статус:</td>
                                            <td>Confirmed / Подтверждено</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="ticket-paper__line"></div>
                            <div className="ticket-paper__passengers">
                                <div>
                                    <img src="img/person.png" />
                                    Passengers information / Информация о пассажирах
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Passenger / Пассажир</th>
                                            <th>Birthday / Дата рождения</th>
                                            <th>Document / Документ</th>
                                        </tr>
                                        {book.passengers.map((p) => (
                                            <tr>
                                                <td>
                                                    {p.firstName} {p.lastName}
                                                </td>
                                                <td>{moment(p.dob).format('DD.MM.YYYY')}</td>
                                                <td>{p.dctNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="ticket-paper__flight">
                                <div>
                                    <img src="img/airplan.png" />
                                    {fromCity.name.en} - {toCity.name.en} / {fromCity.name.ru} - {toCity.name.ru}
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Flight / Рейс</th>
                                            <th>Departing / Отправление</th>
                                            <th>Arriving / Прибытие</th>
                                        </tr>
                                        {book.ticket?.list.map((item) => (
                                            <>
                                                <tr>
                                                    <td>
                                                        <table>
                                                            <tr>
                                                                <td>{item.flyNumber}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>{item.airline}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>{item.transport}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Economy / Эконом</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <table className="ticket-paper__departing">
                                                            <tr>
                                                                <td>{formatDate(item.depatureTime, 'DD.MM.YYYY')}</td>
                                                                <td>{cityDict[item.depatureCity].name.en}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <strong>{formatDate(item.depatureTime, 'HH:mm')}</strong>
                                                                </td>
                                                                <td>{cityDict[item.depatureCity].name.ru}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>&nbsp;</td>
                                                                <td>&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={2}>
                                                                    <strong>Flight time / Время в пути: </strong>
                                                                    <DHMOnBothLng value={item.duration} />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <table className="ticket-paper__departing">
                                                            <tr>
                                                                <td>{formatDate(item.arrivalTime, 'DD.MM.YYYY')}</td>
                                                                <td>{cityDict[item.arrivalCity].name.en}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <strong>{formatDate(item.arrivalTime, 'HH:mm')}</strong>
                                                                </td>
                                                                <td>{cityDict[item.arrivalCity].name.ru}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                {item.transferDuration && (
                                                    <tr>
                                                        <td colSpan={3} className="ticket-paper__transfer">
                                                            <strong>Transfer / Пересадка: </strong>
                                                            <DHMOnBothLng value={item.transferDuration} />
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="ticket-paper__payment">
                                <div>
                                    <img src="img/info.png" />
                                    Payment information / Сведения об оплате
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Fare / Тариф</th>
                                            <th>Service fee / Сервисный сбор</th>
                                            <th>Total cost / Общая стоимость</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Price price={book.bookPrice} />
                                            </td>
                                            <td>
                                                <Price
                                                    price={
                                                        book.bookPrice.currency === 'RUB' ? { amount: 100, currency: 'RUB' } : { amount: 1, currency: 'USD' }
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Price
                                                    price={
                                                        book.bookPrice.currency === 'RUB'
                                                            ? { amount: +book.bookPrice.amount + 100, currency: 'RUB' }
                                                            : { amount: +book.bookPrice.amount + 1, currency: 'USD' }
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="ticket-paper__warning">
                                <div>
                                    <img src="img/warning.png" />
                                    Warning! / Внимание!
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <ul>
                                                    <li>Departures and Arrivals are in local time for each airport.</li>
                                                    <li>
                                                        The airline may change the flights timetable. Please be sure to check your flight departure time 24
                                                        hours before the flight.
                                                    </li>
                                                    <li>
                                                        The quantity of baggage items is the quantity of bags that you can check in as baggage. You can check
                                                        the exact weight or dimensions of the baggage allowed on the airline’s website.
                                                    </li>
                                                    <li>Check-in is complete 60 min. before to departure unless the carrier announces otherwise.</li>
                                                    <li>
                                                        The ticket is only valid when presented with a valid form of ID issued in the name of the person holding
                                                        the ticket: national document or travel passport.
                                                    </li>
                                                </ul>
                                            </td>
                                            <td>
                                                <ul>
                                                    <li>Дата и время вылета и прилета указаны по местному времени для каждого аэропорта.</li>
                                                    <li>
                                                        Авиакомпания может изменить расписание полетов. Пожалуйста, уточните время отправления Вашего рейса за
                                                        сутки до вылета.
                                                    </li>
                                                    <li>
                                                        Точный вес или размер багажа, разрешенный для вашего тарифа, можно узнать на сайте авиакомпании. Число
                                                        мест багажа — это количество мест, которое можно сдать в багаж. При превышении нормы бесплатного провоза
                                                        багажа пассажир обязан оплатить сверхнормативный багаж
                                                    </li>
                                                    <li>Регистрация на рейс заканчивается за 60 мин. до отправления, если иное не установлено перевозчиком.</li>
                                                    <li>Для регистрации в аэропорту необходимо предъявить паспорт.</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="print__ctrls">
                            <div>
                                <button className="submit" onClick={download}>
                                    {t('print.download')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
