import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { AIChatbot } from '@/components/AIChatbot';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 pb-20">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                {children}
            </main>
            <BottomNav />
            <AIChatbot />
        </div>
    );
}
