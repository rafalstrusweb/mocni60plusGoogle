import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthRedirect } from '@/components/auth/AuthWrappers';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                    <p className="text-lg text-muted-foreground">Ładowanie...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to Clerk Sign In or Mock
        return <AuthRedirect />;
    }

    return <>{children}</>;
}
