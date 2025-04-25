import {
    forwardRef,
    ForwardRefRenderFunction,
    InputHTMLAttributes,
} from 'react';

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    name?: string;
    label: string;
    type?: 'radio' | 'checkbox';
}

// Analisar mais opções de autocomplete
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

const CheckboxBase: ForwardRefRenderFunction<
    HTMLInputElement,
    ICheckboxProps
> = ({ label, name, type, ...rest }, ref) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                className="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
                type={type}
                name={name}
                {...rest}
                ref={ref}
            />
            <label className="text-md text-gray-600" htmlFor="flexCheckDefault">
                {label}
            </label>
        </div>
    );
};

export const Checkbox = forwardRef(CheckboxBase);
