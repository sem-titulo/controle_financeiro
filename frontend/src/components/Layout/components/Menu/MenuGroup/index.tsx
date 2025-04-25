/* eslint-disable react/jsx-no-useless-fragment */
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import * as FontAwesome from 'react-icons/fa';

interface IMenuGroupProps {
    children: ReactNode;
    iconName: string;
    colorClassName?: string;
    label: string;
}
export function MenuGroup({
    children,
    iconName,
    colorClassName = `
        bg-slate-700
        hover:bg-slate-600
    `,
    label,
}: IMenuGroupProps) {
    const [expand, setExpand] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setExpand(false);
    }, [router.asPath]);

    return (
        <>
            <div
                className={`
                    p-2
                    space-y-1
                    flex
                    flex-col
                    items-center
                    transition
                    duration-200
                    cursor-pointer
                    rounded-md
                    ${expand ? 'bg-slate-600' : colorClassName}
                `}
                onClick={() => setExpand(prevState => !prevState)}
            >
                {React.createElement(FontAwesome[iconName])}
                <span className="hidden md:block">{label}</span>
            </div>
            {expand && (
                <div className="border border-slate-600 mt-2 rounded-md">
                    {children}
                </div>
            )}
        </>
    );
}
