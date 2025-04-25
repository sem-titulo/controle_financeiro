/* eslint-disable react/jsx-key */
import {
    forwardRef,
    ForwardRefRenderFunction,
    SelectHTMLAttributes,
} from 'react';
import { FieldError } from 'react-hook-form';

export interface IOptions {
    value?: string | number | readonly string[];
    text: string;
    key: string;
}

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: IOptions[];
    addClassName?: string;
    colorClassName?: string;
    labelClassName?: string;
    spanClassName?: string;
    error?: FieldError;
    readOnly?: boolean;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, ISelectProps> = (
    {
        error = null,
        label,
        labelClassName,
        spanClassName = `
            block
            text-md
            text-gray-600
            mt-2
            mb-1
        `,
        options,
        addClassName = 'rounded-md',
        colorClassName = `
            bg-white
        `,
        readOnly,
        ...rest
    },
    ref,
) => {
    return (
        <div className="md:relative">
            <label className={`w-full ${labelClassName}`}>
                {label && <span className={spanClassName}>{label}</span>}

                <div
                    className={`
                        px-4
                        ${readOnly ? 'bg-gray-200' : colorClassName}
                        shadow-lg
                        border
                        border-solid
                        border-gray-300
                        hover:cursor-pointer
                        ring-140
                        ring-black
                        ring-opacity-5
                        ${addClassName}`}
                >
                    <select
                        className={`
                        w-full
                        h-12
                        py-2
                        text-base
                        focus:outline-none
                        z-10
                        bg-transparent
                    `}
                        ref={ref}
                        disabled={readOnly}
                        {...rest}
                    >
                        <option>Escolher</option>
                        {options.map(item => (
                            <option key={item.key} value={item.value}>
                                {item.text}
                            </option>
                        ))}
                    </select>
                </div>
            </label>
            {error?.message ? (
                <span className="text-red-500 text-sm">{error.message}</span>
            ) : null}
        </div>
    );
};

export const Select = forwardRef(SelectBase);
