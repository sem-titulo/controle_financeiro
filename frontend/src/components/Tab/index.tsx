/* eslint-disable prettier/prettier */
import { ReactNode } from 'react';

interface ITab<T> {
    name: T;
    title: string;
}

interface ITabsProps<T> {
    tabs: ITab<T>[];
    tabIs: T;
    setTab: (key: T) => void;
    children: ReactNode;
}

export function Tab<T = unknown>({
    tabs,
    tabIs,
    setTab,
    children,
}: ITabsProps<T>) {
    return (
        <div className="bg-gray-50 mt-4 md:col-span-2 xl:col-span-3">
            <nav className="flex flex-col sm:flex-row">
                {tabs?.map(tab => (
                    <button
                        type="button"
                        key={tab.title}
                        onClick={() => setTab(tab.name)}
                        className={`
                            text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none
                            ${
                                tabIs === tab.name
                                    ? 'text-blue-500 border-b-2 font-medium border-blue-500'
                                    : ''
                            }
                        `}
                    >
                        {tab.title}
                    </button>
                ))}
            </nav>
            {children}
        </div>
    );
}
