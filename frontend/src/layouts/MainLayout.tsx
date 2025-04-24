import React from 'react';
import Navbar from '@/layouts/Navbar/Navbar';
import Footer from '@/layouts/Footer';
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-[100dvh] w-full">
            <Navbar>
                <div className="min-h-[calc(100dvh-64px)]">
                    {children}
                </div>
            </Navbar>
            <Footer />
        </main>
    );
}