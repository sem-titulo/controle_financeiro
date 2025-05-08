/* eslint-disable prettier/prettier */
import React, { ButtonHTMLAttributes } from 'react';
import * as FontAwesome from 'react-icons/fa';
import { ImSpinner9 } from 'react-icons/im';
import { Link } from '../Link';
import styles from './Button.module.css';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    addClassName?: string;
    className?: string;
    iconName?: string;
    children?: string;
    colorClass?: string;
    iconClass?: string;
    isLoading?: boolean; // use para desabilitar o botão quando estiver carregando algo.
    href?: string;
    pattern?: 'confirm' | 'attention' | 'action' | 'normal' | 'revert';
}

export function Button({
    children,
    iconName,
    isLoading,
    addClassName,
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
    iconClass,
    hidden,
    href,
    type = 'button',
    pattern = 'normal',
    ...rest
}: IButtonProps) {
    if (hidden) {
        return null;
    }

    let colorComponent;

    if (!colorClass) {
        if (pattern === 'confirm') {
            colorComponent = 'bg-green-800 hover:bg-green-900';
        } else if (pattern === 'normal') {
            colorComponent =
                'text-slate-700 duration-300 hover:bg-slate-300 border border-slate-500';
        } else if (pattern === 'action') {
            colorComponent =
                'bg-slate-700 duration-300  hover:bg-slate-600 text-slate-200';
        } else if (pattern === 'revert') {
            colorComponent = 'bg-[#ff4c4c] duration-300 hover:bg-[#b20000]';
        }
    }

    if (href) {
        return (
            <Link
                withSpan={false}
                href={href}
                className={`${className} ${addClassName}`}
                colorClass={colorComponent}
            >
                {isLoading ? (
                    <ImSpinner9 className={`${styles.spinner} h-3 w-3 mx-2`} />
                ) : null}

                {iconName && (
                    <div className="flex justify-center items-center">
                        {React.createElement(FontAwesome[iconName], {
                            className: iconClass,
                        })}
                    </div>
                )}

                {children && (
                    <span className="hidden md:block">{children}</span>
                )}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={`
                    ${className}
                    ${addClassName}
                    ${colorComponent}
                    ${
                        isLoading
                            ? `
                        text-black
                        hover:bg-gray-400
                        bg-gray-400
                        border
                        border-black
                        font-bold
                    `
                            : null
                    }`}
            {...rest}
            disabled={isLoading}
        >
            {isLoading ? (
                <ImSpinner9
                    className={`text-white ${styles.spinner} h-3 w-3 mx-2`}
                />
            ) : null}

            {iconName && (
                <div className="flex justify-center items-center">
                    {React.createElement(FontAwesome[iconName], {
                        className: iconClass,
                    })}
                </div>
            )}
            {children && <span className="hidden md:block">{children}</span>}
        </button>
    );
}
