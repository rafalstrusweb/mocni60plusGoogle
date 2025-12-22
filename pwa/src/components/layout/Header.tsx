import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        setIsProfileOpen(false);
        await signOut();
        navigate('/login');
    };

    // Get user display info
    const displayName = user?.displayName || 'Użytkownik';
    const avatarUrl = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0050A1&color=fff`;
    const email = user?.email || '';

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4">
                {/* Left - Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                {/* Center - App Name */}
                <h1 className="text-2xl font-bold tracking-tight text-primary">
                    Mocni60+
                </h1>

                {/* Right - Profile */}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="h-12 w-12 overflow-hidden rounded-full border-2 border-border shadow-sm hover:border-primary transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Menu profilu"
                        aria-expanded={isProfileOpen}
                    >
                        <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-border">
                                <p className="font-bold text-lg text-foreground">{displayName}</p>
                                <p className="text-muted-foreground text-base truncate">{email}</p>
                            </div>

                            {/* Menu items - Large touch targets for elderly users */}
                            <div className="py-2">
                                <button
                                    className="w-full flex items-center gap-4 px-4 py-4 text-left text-lg hover:bg-primary/5 active:bg-primary/10 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <User className="h-6 w-6 text-primary" />
                                    <span className="font-medium">Mój profil</span>
                                </button>
                                <button
                                    className="w-full flex items-center gap-4 px-4 py-4 text-left text-lg hover:bg-primary/5 active:bg-primary/10 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <Settings className="h-6 w-6 text-primary" />
                                    <span className="font-medium">Ustawienia</span>
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-border pt-2">
                                <button
                                    className="w-full flex items-center gap-4 px-4 py-4 text-left text-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-6 w-6" />
                                    <span className="font-medium">Wyloguj się</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
