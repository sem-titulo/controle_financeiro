/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITheadProps {
    index: number;
    children: ReactNode;
}

export function Tr({ index, children }: ITheadProps) {
    return (
        <tr
            className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    text-black border-b cursor-pointer`}
        >
            {children}
        </tr>
    );
}
