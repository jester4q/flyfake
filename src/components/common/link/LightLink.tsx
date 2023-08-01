import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function LightLink({ to, children }: React.ComponentProps<any>) {
    const local = to[0] === '/';
    const className = 'link_light';
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
