import { FormHTMLAttributes, ReactNode } from 'react';

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode;
    className?: string;
}

export function Form({
    children,
    className = 'grid md:grid-cols-2 xl:grid-cols-3 md:gap-x-5 gap-y-2 pb-3',
    ...rest
}: IFormProps) {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="py-2 align-middle inline-block min-w-full ">
                    <div className="overflow-hidden">
                        <form className={className} {...rest} action="">
                            {children}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
