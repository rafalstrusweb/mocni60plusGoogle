import { createContext, useContext, useState, ReactNode } from 'react';
import { logAction } from '@/lib/audit';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    signIn: () => void;
    signOut: () => Promise<void>;
    verifyUserStateless: () => Promise<void>;
}

export const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export function useMockAuth() {
    const context = useContext(MockAuthContext);
    if (context === undefined) {
        throw new Error('useMockAuth must be used within a MockAuthProvider');
    }
    return context;
}

const MOCK_USER = {
    uid: 'mock-user-123',
    id: 'mock-user-123',
    fullName: 'Janina Kowalska (Mock)',
    firstName: 'Janina',
    primaryEmailAddress: { emailAddress: 'janina@example.com' },
    imageUrl: 'https://ui.shadcn.com/avatars/01.png',
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
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

    const verifyUserStateless = async () => {
        console.log("Stateless Verification Triggered (Mock)");
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signOut,
        verifyUserStateless
    };

    return (
        <MockAuthContext.Provider value={value}>
            {children}
        </MockAuthContext.Provider>
    );
}
