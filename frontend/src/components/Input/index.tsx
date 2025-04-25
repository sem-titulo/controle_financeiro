import {
    forwardRef,
    ForwardRefRenderFunction,
    InputHTMLAttributes,
} from 'react';
import {
    DeepRequired,
    FieldError,
    FieldErrorsImpl,
    Merge,
} from 'react-hook-form';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    className?: string;
    colorClassName?: string;
    spanClassName?: string;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<DeepRequired<any>>>;
    webkitdirectory?: string;
    directory?: string;
}

// Analisar mais opções de autocomplete
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
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
        type,
        onFocus,
        onBlur,
        ...rest
    },
    ref,
) => {
    return (
        <label className={`w-full ${labelClassName}`}>
            {label && <span className={spanClassName}>{label}</span>}
            <input
                className={`${className}
                            ${readOnly ? 'bg-gray-200' : colorClassName}
                    `}
                disabled={readOnly}
                autoComplete="off"
                type={type}
                onFocus={e => {
                    if (type === 'number') {
                        const value = Number(e.target.value);
                        if (value === 0) {
                            e.target.value = '';
                        }
                    }

                    if (onFocus) {
                        onFocus(e);
                    }
                }}
                onBlur={e => {
                    if (type === 'number') {
                        const value = Number(e.target.value);
                        if (value === 0) {
                            e.target.value = '0';
                        }
                    }

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

export const Input = forwardRef(InputBase);
