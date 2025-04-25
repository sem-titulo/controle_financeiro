import { ReactNode } from 'react';
import { Buttonbar } from '../Buttonbar';
import { Loading } from '../Loading';

interface IContentProps {
    children: ReactNode;
}

export function Content({ children }: IContentProps) {
    return (
        <div className="flex-1 overflow-y-hidden flex flex-col">{children}</div>
    );
}

interface IContentBodyProps {
    children?: ReactNode;
    buttonbar?: ReactNode[];
    loading?: boolean;
}

export function ContentBody({
    children,
    buttonbar,
    loading = false,
}: IContentBodyProps) {
    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {buttonbar && (
                <Buttonbar>{buttonbar.map(button => button)}</Buttonbar>
            )}
            <div className="flex-1 w-full overflow-x-auto overflow-y-auto py-2 text-black flex justify-center items-center pl-3 pr-2">
                {children && (
                    <div className="h-full w-full space-y-4 flex-1">
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}
