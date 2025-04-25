import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

export interface ICheckboxContainerProps {
    label: string;
    children: ReactNode;
    error: FieldError;
}

// Analisar mais opções de autocomplete
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

export function CheckboxContainer({
    label,
    children,
    error,
}: ICheckboxContainerProps) {
    return (
        <div
            className="
                h-full
                rounded-md
                flex-1
                w-full
            "
        >
            {/* <div> */}
            <span
                className="
                    block
                    text-md
                    text-gray-600
                    mt-2
                    mb-1
                "
            >
                {label}
            </span>
            {children}
            {error?.message && (
                <span className="text-red-500 text-sm">{error.message}</span>
            )}
        </div>
    );
}
