import { ReactNode } from 'react';

interface IMenuProps {
    children: ReactNode;
}

export function Menu({ children }: IMenuProps) {
    return <div>{children}</div>;
}
