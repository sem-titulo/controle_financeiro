import {
    DeepRequired,
    FieldError,
    FieldErrorsImpl,
    Merge,
} from 'react-hook-form';
import { MdOutlineErrorOutline } from 'react-icons/md';

interface ITableErrorsProps<T> {
    errors: Merge<
        FieldError,
        Merge<FieldError, FieldErrorsImpl<DeepRequired<T>>>[]
    >;
}

export function TableErrors<T>({ errors }: ITableErrorsProps<T>) {
    if (!errors) {
        return null;
    }
    const keys =
        errors?.length > 0
            ? Object.keys(errors.find(error => !!error) ?? {})
            : [];

    if (keys.length === 0) {
        return null;
    }

    return (
        <div className="bg-yellow-100 md:col-span-2 xl:col-span-3 p-4 rounded-md border flex items-center gap-5 shadow-md">
            <MdOutlineErrorOutline className="text-[4rem] text-red-700" />
            <ul>
                {errors.map((error, index) => {
                    if (error)
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={`error_${index + 1}`}>
                                <h3 className="text-sm font-bold">
                                    Erros na linha {index + 1}
                                </h3>
                                {keys.map(key => (
                                    <p key={`error_${index + 1}_${key}`}>
                                        {error[key].message}
                                    </p>
                                ))}
                            </li>
                        );

                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    return <></>;
                })}
            </ul>
        </div>
    );
}

export default TableErrors;
