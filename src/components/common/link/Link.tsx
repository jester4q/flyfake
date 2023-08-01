import { Link as RouterLink } from 'react-router-dom';

export default function Link({ to, children }: React.ComponentProps<any>) {
    const local = to[0] === '/';
    const className = 'link';
    return (
        <>
            {(local && (
                <RouterLink className={className} to={to}>
                    {children}
                </RouterLink>
            )) || (
                <a className={className} href={to}>
                    {children}
                </a>
            )}
        </>
    );
}
