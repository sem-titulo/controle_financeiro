import { ReactNode } from 'react';

interface ISidebarProps {
    children: ReactNode;
    addClassName?: string;
    isMenuClosed?: boolean;
}

export function Sidebar({
    children,
    addClassName = null,
    isMenuClosed = true,
}: ISidebarProps) {
    return (
        <aside
            className={`
                px-2
                pb-2
                bg-slate-700
                fixed
                md:relative
                h-full
                md:h-screen
                ${isMenuClosed ? '-translate-x-full' : null}
                md:translate-x-0
                top-0
                left-0
                transition
                ease-in-out
                flex
                flex-col
                justify-between
                justify-items-center
                z-30
                md:w-36
                ${addClassName}
            `}
        >
            {children}
        </aside>
    );
}
