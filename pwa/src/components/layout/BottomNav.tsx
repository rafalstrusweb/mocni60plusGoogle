import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Map, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Start', path: '/' },
        { icon: Briefcase, label: 'Praca', path: '/gigs' },
        { icon: Map, label: 'Podróże', path: '/travel' },
        // Only showing top 3-4 items for clarity on mobile, relying on "More" or spacing if needed.
        // For MVP, let's include all 5 icons if they fit, or limit to main ones.
        // Let's do 5 items.
        { icon: Users, label: 'Ludzie', path: '/community' },
        // { icon: GraduationCap, label: 'Wiedza', path: '/lms' }, // Maybe under specific menu
        { icon: Heart, label: 'Zdrowie', path: '/health' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe">
            <div className="flex h-20 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 p-2 transition-colors min-w-[64px]",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-7 w-7", isActive && "fill-current")} strokeWidth={2} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
