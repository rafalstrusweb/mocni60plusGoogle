import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShieldCheck, CheckCheck, Info, Briefcase, Map, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { AuthSignedIn, AuthSignedOut, AuthSignInButton, AuthUserButton } from '@/components/auth/AuthWrappers';

function NotificationIcon({ type }: { type: Notification['type'] }) {
    const iconClass = "h-5 w-5";
    switch (type) {
        case 'job':
            return <Briefcase className={`${iconClass} text-green-600`} />;
        case 'travel':
            return <Map className={`${iconClass} text-orange-600`} />;
        case 'community':
            return <Users className={`${iconClass} text-purple-600`} />;
        case 'system':
        default:
            return <Info className={`${iconClass} text-blue-600`} />;
    }
}

export function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const { user, signOut } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, simulateNotification } = useNotifications();
    const navigate = useNavigate();

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
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

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
            setIsNotificationsOpen(false);
        }
    };

    // Get user display info
    const displayName = user?.displayName || 'Użytkownik';
    const avatarUrl = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0050A1&color=fff`;
    const email = user?.email || '';

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4">
                {/* Left - Notifications */}
                <div className="relative" ref={notificationDropdownRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        aria-label="Powiadomienia"
                    >
                        <Bell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute right-2 top-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>

                    {isNotificationsOpen && (
                        <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                                <h3 className="font-bold text-lg">Powiadomienia</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Oznacz wszystkie
                                    </button>
                                )}
                            </div>

                            {/* Notifications list */}
                            <div className="overflow-y-auto flex-1">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-muted-foreground">
                                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-lg">Brak powiadomień</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-primary/5 active:bg-primary/10 transition-colors border-b border-border/50 last:border-0 ${!notification.read ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <div className={`mt-1 p-2 rounded-full ${notification.type === 'job' ? 'bg-green-100' :
                                                notification.type === 'travel' ? 'bg-orange-100' :
                                                    notification.type === 'community' ? 'bg-purple-100' :
                                                        'bg-blue-100'
                                                }`}>
                                                <NotificationIcon type={notification.type} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-medium text-base truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                            {notification.read && (
                                                <Check className="h-4 w-4 text-muted-foreground/50 mt-1 flex-shrink-0" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Center - App Name */}
                <h1 className="text-2xl font-bold tracking-tight text-primary">
                    Mocni60+
                </h1>

                {/* Right - Profile Dropdown */}
                {/* Right - user & Actions */}
                <div className="flex items-center gap-2">
                    <AuthSignedOut>
                        <AuthSignInButton mode="modal">
                            <Button variant="default" className="rounded-full">Zaloguj się</Button>
                        </AuthSignInButton>
                    </AuthSignedOut>
                    <AuthSignedIn>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/verify')}
                            title="Zweryfikuj tożsamość"
                            className="mr-2"
                        >
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </Button>
                        <AuthUserButton />
                    </AuthSignedIn>
                </div>
            </div>
        </header>
    );
}
