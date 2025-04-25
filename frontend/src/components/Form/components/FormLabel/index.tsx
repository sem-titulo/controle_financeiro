interface IFormLabelProps {
    children: string;
    className?: string;
}

export function FormLabel({
    children,
    className = 'md:col-span-2 xl:col-span-3 mt-5 font-semibold',
}: IFormLabelProps) {
    return <label className={className}>{children}</label>;
}
