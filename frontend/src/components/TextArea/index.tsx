import {
    forwardRef,
    ForwardRefRenderFunction,
    TextareaHTMLAttributes,
} from 'react';
import { FieldError } from 'react-hook-form';

export interface ITextAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    labelClassName?: string;
    className?: string;
    colorClassName?: string;
    spanClassName?: string;
    error?: FieldError;
    webkitdirectory?: string;
    directory?: string;
}

// Analisar mais opções de autocomplete
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

const TextAreaBase: ForwardRefRenderFunction<
    HTMLTextAreaElement,
    ITextAreaProps
> = (
    {
        error = null,
        label,
        spanClassName = `
            block
            text-md
            text-gray-600
            mt-2
            mb-1
        `,
        className = `
            h-12
            border
            border-solid
            rounded-md
            border-gray-300
            flex-1
            block
            w-full
            p-3
            text-gray-700
            appearance-none
            shadow-md
            focus:shadow-blue-200
        `,
        colorClassName = `
            bg-white
        `,
        labelClassName,
        readOnly = false,
        onFocus,
        onBlur,
        ...rest
    },
    ref,
) => {
    return (
        <label className={`w-full ${labelClassName}`}>
            {label && <span className={spanClassName}>{label}</span>}
            <textarea
                className={`${className}
                            ${readOnly ? 'bg-gray-200' : colorClassName}
                    `}
                disabled={readOnly}
                autoComplete="off"
                onFocus={e => {
                    if (onFocus) {
                        onFocus(e);
                    }
                }}
                onBlur={e => {
                    if (onBlur) {
                        onBlur(e);
                    }
                }}
                ref={ref}
                {...rest}
            />
            {error?.message && (
                <span className="text-red-500 text-sm">{error.message}</span>
            )}
        </label>
    );
};

export const TextArea = forwardRef(TextAreaBase);
