import { useState } from 'react';
import Ticket from '../ticket/Ticket';
import NoResults from './NoResults';
import { TSearchFilter, TTicket } from '../../types';
import useOnFetch from '../../hooks/useOnFetch';
import Loading from '../common/loading/Loading';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

export default function TicketsList({ filter, onBook }: { filter?: TSearchFilter; onBook?: (t: TTicket) => void }) {
    if (!filter) {
        return <></>;
    }
    const [t] = useTranslation('common');

    const [page, setPage] = useState<number>(0);
    let query = '';

    (Object.keys(filter) as Array<keyof typeof filter>).forEach((key) => {
        if (filter[key]) {
            let v;
            if (key === 'departure' || key === 'arrival') {
                v = `${key}=${String(filter[key]?.code)}`;
            } else if (key === 'travelers') {
                const travelers = filter[key];
                v = `adult=${travelers.adult}&child=${travelers.child}&infant=${travelers.infant}`;
            } else {
                v = `${key}=${String(filter[key] || '')}`;
            }
            query += (query.length ? '&' : '') + v;
        }
    });

    const url = `/ticket/search?` + query;
    const { status, data } = useOnFetch<TTicket>(url);

    if (status === 'fetching') {
        page > 0 && setPage(0);
        return <Loading />;
    }

    const maxPage = data.length / PAGE_SIZE - 1 + ((data.length % PAGE_SIZE && 1) || 0);

    return (
        <div className="homepage__list">
            {(data.length && (
                <>
                    <div className="homepage__ticket">
                        {data.slice(0, (page + 1) * PAGE_SIZE).map((item, i) => (
                            <Ticket key={i} data={item} onSelect={() => onBook && onBook(item)} />
                        ))}
                    </div>

                    {maxPage > page && (
                        <div className="homepage__show-more">
                            <button className="action" onClick={() => setPage(() => page + 1)}>
                                <span>{t('ticket.show_more', { pagesize: PAGE_SIZE })}</span>
                            </button>
                        </div>
                    )}
                </>
            )) || <NoResults />}
        </div>
    );
}
