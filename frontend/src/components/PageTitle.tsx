import { ReactNode } from 'react';

interface PageTitleProps {
    title: string;
    children?: ReactNode;
}

export default function PageTitle({ title, children }: PageTitleProps) {
    return (
        <>
            <div className="flex items-center my-4 pt-4">
                <h1 className="font-bold text-2xl mr-2">{title}</h1>
                {
                    children && (
                        <div>
                            {children}
                        </div>
                    )
                }
            </div>
            <div className="divider my-4"></div>
        </>
    );
}