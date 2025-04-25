/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITheadProps {
    children: ReactNode;
}

export function Thead({ children }: ITheadProps) {
    return (
        <thead className="bg-gray-100">
            <tr className="text-left">{children}</tr>
        </thead>
    );
}
