import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-[100dvh] w-full">
            {children}
        </main>
    );
}