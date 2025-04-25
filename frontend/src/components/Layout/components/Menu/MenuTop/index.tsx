import { ReactNode } from 'react';
import { Link } from '../../../../Link';

interface IMenuTop {
    children: ReactNode;
    href?: string;
}

export function MenuTop({ children, href }: IMenuTop) {
    if (href)
        return (
            <Link href={href} className="flex justify-center mt-5 mb-10">
                {children}
            </Link>
        );

    return <span className="flex justify-center mt-5 mb-10">{children}</span>;
}
