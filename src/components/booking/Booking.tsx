import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { BookPassenger, factoryBook } from '../../domain/Book';
import { useNavigate } from 'react-router-dom';
import { Link } from '../common/link';
import TicketDetails from '../ticket/TicketDetails';
import Passenger from './Passenger';

import './booking.scss';
import { TBookPassenger } from '../../types';
import { useEffect, useRef, useState } from 'react';
import RadioGroup from '../common/radio-group/RadioGroup';
import Price from '../common/price/Price';

export default function Booking() {
    const book = factoryBook();
    const [t, i18nConfig] = useTranslation('common');
    const [passangers, setPassangers] = useState<TBookPassenger[]>(book.generatePassangers());
    const [bookVariant, setBookVariant] = useState<string>('');
    const [passangeIndex, setPassangeIndex] = useState<number>(book.failedPassangerIndex());
    const ref = useRef<HTMLDivElement>(null);
    const lng = i18nConfig.language;
    const nav = useNavigate();
    moment.locale(lng);

    if (!book.ticket || !book.travelers) {
        nav('/', { replace: false });
        return <></>;
    }
    const ticket = book.ticket;
    const travelers = book.travelers;
    const path = book.path;
    const date1 = moment(path.fromDate).format('DD MMM, dd');
    const date2 = moment(path.toDate).format('DD MMM, dd');
    const from = path.fromCity;
    const to = path.toCity;
    const adult = t('booking.adult', { count: travelers.adult });
    const child = travelers.child ? t('booking.child', { count: travelers.child }) : '';
    const infant = travelers.infant ? t('booking.infant', { count: travelers.infant }) : '';

    let date = date1;
    if (date1 !== date2) {
        date = `${date1} - ${date2}`;
    }

    const chagePassenger = (p: TBookPassenger, index: number) => {
        const result = [...passangers];
        result[index] = p;
        book.passengers = result;
        setPassangers(result);
    };

    const changeBookingVariant = (v: string) => {
        if (v == 'book' || v == 'reserve') {
            book.bookVariant = v;
            setBookVariant(v);
        }
    };

    const onSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        book.passengers = [...passangers];
        const result = book.validate();
        setPassangeIndex(book.failedPassangerIndex());
        if (result) {
            nav('/print', { replace: false });
        }
        return false;
    };

    useEffect(() => {
        if (ref.current && passangeIndex >= 0) {
            const section: HTMLDivElement = ref.current.children[passangeIndex + 1] as HTMLDivElement;
            if (section) {
                section.scrollIntoView();
            }
            setPassangeIndex(-1);
        }
    }, [passangeIndex]);

    return (
        <main className="booking">
            <section className="booking__heading">
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
                            <button className="active">
                                <span className="breadcrumbs__icon">
                                    <span>
                                        <svg fill="colorTextPrimaryNormal" name="calendar" rotate="">
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
                                        <svg fill="colorTextPrimaryNormal" name="coins" rotate="">
                                            <use xlinkHref="#kb_coins"></use>
                                        </svg>
                                    </span>
                                </span>
                                <span className="breadcrumbs__text">{t('booking.step2')}</span>
                            </button>
                            <div>
                                <div></div>
                            </div>
                            <button>
                                <span className="breadcrumbs__icon">
                                    <span>
                                        <svg fill="colorTextPrimaryNormal" name="ticket_horizontal" rotate="">
                                            <use xlinkHref="#kb_ticket_horizontal"></use>
                                        </svg>
                                    </span>
                                </span>
                                <span className="breadcrumbs__text">{t('booking.step3')}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="booking__warp">
                    <div className="booking__title">
                        <div>
                            <h4>{t('booking.title')}</h4>
                            <h1>
                                {from}
                                <span className={path.return ? 'back' : ''}></span>
                                {to}
                            </h1>
                            <sub>
                                {date}, {[adult, child, infant].filter((x) => !!x).join(', ')}
                            </sub>
                        </div>
                    </div>
                </div>
            </section>
            <section className="booking__details">
                <div className="booking__warp">
                    <div className="booking__body">
                        <TicketDetails data={book.ticket!} />
                        <form>
                            <div className="booking__passengers" ref={ref}>
                                <div className="booking__passengers__title">
                                    <h1>{t('booking.passenger_title')}</h1>
                                </div>
                                {passangers.map((p, i) => {
                                    const v = new BookPassenger(p);
                                    if (book.validated()) {
                                        v.validate();
                                    }
                                    return <Passenger key={i} value={v} no={i + 1} setValue={(v) => chagePassenger(v, i)} />;
                                })}
                            </div>
                            <div className="booking__options">
                                <div>
                                    <RadioGroup
                                        value={bookVariant}
                                        setValue={changeBookingVariant}
                                        dict={[
                                            { id: 'book', title: t('booking.book_ticket'), price: book.bookPrice },
                                            { id: 'reserve', title: t('booking.reserve_ticket'), price: book.reservePrice },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="booking__total">
                                <div>
                                    <div>
                                        <div className="booking__total__text">
                                            {(bookVariant && (
                                                <>
                                                    <h1>{t('booking.price')}:</h1>
                                                    <h1>
                                                        <Price price={book.price} />
                                                    </h1>
                                                </>
                                            )) ||
                                                ''}
                                        </div>
                                    </div>
                                    <button className="submit" onClick={onSubmit} disabled={!bookVariant || bookVariant == 'book'}>
                                        <span className="booking__total__button-title">{t('booking.continue')}</span>
                                        <span className="booking__total__button-icon">
                                            <span>
                                                <svg fill="background" name="arrow-right-long" rotate="">
                                                    <use xlinkHref="#kb_arrow-right-long"></use>
                                                </svg>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
