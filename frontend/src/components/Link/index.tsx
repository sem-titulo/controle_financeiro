import React, { LinkHTMLAttributes, ReactNode } from 'react';
import * as FontAwesome from 'react-icons/fa';

import NextLink from 'next/link';

interface ILinkProps extends LinkHTMLAttributes<HTMLLinkElement> {
    className?: string;
    colorClass?: string;
    href: string;
    iconName?: string;
    iconClass?: string;
    children: ReactNode;
    withSpan?: boolean;
}

export function Link({
    children,
    href,
    iconName,
    iconClass,
    className = `
        h-8
        md:h-12
        w-12
        md:w-32
        shadow-md
        flex
        flex-row
        space-x-3
        items-center
        justify-center
        font-light
        px-4
        py-2
        text-gray-50
        rounded-md
        tracking-wide
    `,
    colorClass,
    withSpan = true,
}: ILinkProps) {
    if (withSpan) {
        return (
            <NextLink href={href}>
                <a className={`${className} ${colorClass}`}>
                    {iconName && (
                        <div className="flex justify-center items-center">
                            {React.createElement(FontAwesome[iconName], {
                                className: iconClass,
                            })}
                        </div>
                    )}

                    {children && <span className="md:block">{children}</span>}
                </a>
            </NextLink>
        );
    }

    return (
        <NextLink href={href}>
            <a className={`${className} ${colorClass}`}>
                {iconName && (
                    <div className="flex justify-center items-center">
                        {React.createElement(FontAwesome[iconName], {
                            className: iconClass,
                        })}
                    </div>
                )}

                {children}
            </a>
        </NextLink>
    );
}
