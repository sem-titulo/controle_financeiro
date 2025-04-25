/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITableProps {
    children: ReactNode;
}

export function Tbody({ children }: ITableProps) {
    return (
        <tbody className="divide-y divide-gray-300 text-sm">{children}</tbody>
    );
}
