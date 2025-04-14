import React from "react";

interface CollectionContainerProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function CollectionContainer({
    header,
    children
}: CollectionContainerProps) {
    return (
        <div className="flex flex-col">
            <div>{header && header}</div>
            <div className="py-8 border border-base-300">
                {children}
            </div>
        </div>
    );
}