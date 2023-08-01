import { useTranslation } from 'react-i18next';

export default function DHMOnBothLng({ value }: { value: number }) {
    const flight = [0, Math.floor(value / 60), value % 60];
    flight[0] = Math.floor(flight[1] / 24);
    if (flight[0] > 0) {
        flight[1] -= flight[0] * 24;
    }

    return (
        <span>
            {flight[0] ? `${flight[0]} d ` : ''}
            {flight[1]} h {flight[2]} min / {flight[0] ? `${flight[0]} д ` : ''}
            {flight[1]} ч {flight[2]} мин
        </span>
    );
}
