interface PageTitleProps {
    title: string;
    titleChildren?: string;
}

export default function PageTitle({ title, titleChildren }: PageTitleProps) {
    return (
        <>
            <div className="flex items-center gap-2 my-4 pt-4">
                <h1 className="font-bold text-2xl leading-none">{title}</h1>
                {titleChildren && (
                    <span className="text-base-content/70 text-base leading-none ml-2">{`(${titleChildren})`}</span>
                )}
            </div>
            <div className="divider my-4"></div>
        </>
    );
}
