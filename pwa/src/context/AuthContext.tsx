import { createContext, useContext, ReactNode, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { logAction } from '@/lib/audit';

// Adapter Interface to match existing usage
interface AuthContextType {
    user: any | null; // Adapting Clerk user to { uid: string, ... }
    loading: boolean;
    signIn: () => void;
    signOut: () => Promise<void>;
    verifyUserStateless: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const MOCK_USER = {
    uid: 'mock-user-123',
    id: 'mock-user-123',
    fullName: 'Janina Kowalska (Mock)',
    firstName: 'Janina',
    primaryEmailAddress: { emailAddress: 'janina@example.com' },
    imageUrl: 'https://ui.shadcn.com/avatars/01.png',
};

export function AuthProvider({ children }: AuthProviderProps) {
    // ---- MOCK IMPLEMENTATION ----
    if (USE_MOCK_AUTH) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [user, setUser] = useState<any | null>(null);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [loading, setLoading] = useState(false);

        const signIn = () => {
            setLoading(true);
            setTimeout(() => {
                setUser(MOCK_USER);
                setLoading(false);
                logAction('LOGIN', MOCK_USER.uid, 'Mock User logged in');
            }, 500);
        };

        const signOut = async () => {
            setLoading(true);
            setTimeout(() => {
                setUser(null);
                setLoading(false);
                logAction('LOGOUT', MOCK_USER.uid, 'Mock User logged out');
            }, 500);
        };

        const verifyUserStateless = async () => console.log("Stateless Verification Triggered (Mock)");

        return (
            <AuthContext.Provider value={{ user, loading, signIn, signOut, verifyUserStateless }}>
                {children}
            </AuthContext.Provider>
        );
    }

    // ---- CLERK IMPLEMENTATION ----
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const { openSignIn, signOut: clerkSignOut } = useClerk();

    // Adapter: Map Clerk User to existing app expectations (uid)
    const user = isSignedIn && clerkUser ? {
        uid: clerkUser.id,
        displayName: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        ...clerkUser
    } : null;

    const signIn = () => {
        openSignIn();
    };

    const signOut = async () => {
        if (user) {
            logAction('LOGOUT', user.uid, 'User logged out (Clerk)');
        }
        await clerkSignOut();
    };

    const verifyUserStateless = async () => {
        console.log("Stateless Verification Triggered (Clerk)");
    };

    const value: AuthContextType = {
        user,
        loading: !isLoaded,
        signIn,
        signOut,
        verifyUserStateless
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
