export default function Price({ price }: { price: { currency: string; amount: number } }) {
    return (
        <>
            {(price.currency == 'USD' && '$ ') || ''}
            {price.amount}
            {(price.currency == 'RUB' && ' ₽') || ''}
        </>
    );
}
