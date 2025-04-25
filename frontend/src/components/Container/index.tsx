import { ReactNode } from 'react';

interface IContainerProps {
    children: ReactNode;
}

export function Container({ children }: IContainerProps) {
    return (
        <div className="h-screen w-screen bg-gray-50 flex flex-row">
            {children}
        </div>
    );
}
