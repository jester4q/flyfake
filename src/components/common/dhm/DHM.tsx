import { useTranslation } from 'react-i18next';

export default function DHM({ value }: { value: number }) {
    const [t] = useTranslation('common');
    const flight = [0, Math.floor(value / 60), value % 60];
    flight[0] = Math.floor(flight[1] / 24);
    if (flight[0] > 0) {
        flight[1] -= flight[0] * 24;
    }

    return (
        <span>
            {flight[0] ? `${flight[0]}${t('ticket.d')} ` : ''}
            {flight[1]}
            {t('ticket.h')} {flight[2]}
            {t('ticket.m')}
        </span>
    );
}
