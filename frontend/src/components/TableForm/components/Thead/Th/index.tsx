/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITheadProps {
    children?: ReactNode;
}

export function Th({ children }: ITheadProps) {
    return (
        <th className={`${!children && 'w-8'} px-6 py-4 whitespace-nowrap`}>
            {children}
        </th>
    );
}
