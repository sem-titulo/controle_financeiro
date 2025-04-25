/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { ReactNode } from 'react';

interface ITableFormProps {
    children: ReactNode;
}

export function TableForm({ children }: ITableFormProps) {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b sm:rounded-lg border border-gray-300 shadow-md">
                        <table className="min-w-full divide-y divide-gray-300  tracking-wider">
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
