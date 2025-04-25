import { ReactNode } from 'react';

interface ITabFieldsProps {
    children: ReactNode;
}

export function TabFields({ children }: ITabFieldsProps) {
    return (
        <div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 md:gap-x-5 gap-y-2 py-3">
                {children}
            </div>
        </div>
    );
}
