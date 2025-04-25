import { ReactNode } from 'react';

interface IButtonbarProps {
    namePage?: string;
    children: ReactNode;
    isForm?: boolean;
}

export function Buttonbar({
    namePage = '',
    children,
    isForm = false,
}: IButtonbarProps) {
    if (isForm) {
        return (
            <div className="fixed z-50 right-0 pr-4">
                <div className="flex space-x-2 justify-end">{children}</div>
            </div>
        );
    }
    return (
        <div className="flex space-x-2 justify-between">
            <div>
                <h1 className="md:col-span-2 xl:col-span-3 mt-5 font-semibold">
                    {namePage}
                </h1>
            </div>
            <div className="flex space-x-2">{children}</div>
        </div>
    );
}
