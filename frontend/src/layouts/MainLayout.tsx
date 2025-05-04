import React from 'react';
import Navbar from '@/layouts/Navbar/Navbar';
import Footer from '@/layouts/Footer';
import LoginForm from '@/components/LoginForm/LoginForm';
import AuthInitializer from '@/components/Auth/AuthInitializer';
import CloseOnClickOutSideModal from '@/components/CloseOnClickOutSideModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-[100dvh] w-full">
            {/* Initialize authentication state */}
            <AuthInitializer />

            <Navbar>
                <div className="min-h-[calc(100dvh-64px)]">
                    {children}
                </div>
            </Navbar>
            <Footer />
            <LoginForm />
        </main>
    );
}