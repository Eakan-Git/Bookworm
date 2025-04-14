import React from "react";

interface CollectionContainerProps {
    header: React.ReactNode;
    children: React.ReactNode;
}

export default function CollectionContainer({
    header,
    children
}: CollectionContainerProps) {
    return (
        <div className="flex flex-col gap-4">
            <div>{header}</div>
            <div
                className="px-4 py-8 border border-base-300"
            >{children}</div>
        </div>
    );
}