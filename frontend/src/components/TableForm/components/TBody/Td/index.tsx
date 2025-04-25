/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITdProps {
    children: ReactNode;
}

export function Td({ children }: ITdProps) {
    return (
        <td className="px-6 py-4 flex-row items-center justify-center whitespace-nowrap">
            {children}
        </td>
    );
}
