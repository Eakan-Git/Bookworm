import React from 'react';
import Navbar from '@/components/navigators/Navbar';
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-[100dvh] w-full">
            <Navbar>
                {children}
            </Navbar>
        </main>
    );
}