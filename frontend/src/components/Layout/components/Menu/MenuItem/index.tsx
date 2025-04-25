import React from 'react';
import * as FontAwesome from 'react-icons/fa';
import { Link } from '../../../../Link';

interface IMenuItemProps {
    children: string;
    iconName: string;
    onClick?: () => void;
    href?: string;
}
export function MenuItem({
    children,
    iconName,
    onClick,
    href,
}: IMenuItemProps) {
    if (href) {
        return (
            <Link
                href={href}
                iconName={iconName}
                className={`
                    p-2
                    space-y-1
                    flex
                    flex-col
                    items-center
                    transition
                    duration-200
                    rounded-md
                `}
                colorClass={`
                    bg-slate-700
                    hover:bg-slate-600
                `}
            >
                <span className="hidden md:block">{children}</span>
            </Link>
        );
    }
    return (
        <div
            className={`
                p-2
                space-y-1
                flex
                flex-col
                items-center
                transition
                duration-200
                bg-slate-700
                hover:bg-slate-600
                cursor-pointer
                rounded-md
            `}
            onClick={onClick}
        >
            {React.createElement(FontAwesome[iconName])}
            <span className="hidden md:block">{children}</span>
        </div>
    );
}
