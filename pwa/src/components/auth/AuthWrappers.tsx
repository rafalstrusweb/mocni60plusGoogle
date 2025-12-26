import { ReactNode } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, RedirectToSignIn } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// --- WRAPPERS ---

export function AuthRedirect() {
    const { signIn } = useAuth();
    if (USE_MOCK_AUTH) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-bold">Wymagane logowanie (Mock)</h2>
                <Button onClick={() => signIn()}>Zaloguj się jako Janina (Mock)</Button>
            </div>
        );
    }
    return <RedirectToSignIn />;
}

export function AuthSignedIn({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    if (USE_MOCK_AUTH) {
        return user ? <>{children}</> : null;
    }
    return <SignedIn>{children}</SignedIn>;
}

export function AuthSignedOut({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    if (USE_MOCK_AUTH) {
        return !user ? <>{children}</> : null;
    }
    return <SignedOut>{children}</SignedOut>;
}

export function AuthSignInButton({ mode, children }: { mode?: string, children: ReactNode }) {
    const { signIn } = useAuth();
    if (USE_MOCK_AUTH) {
        // Render simple button that triggers mock sign in
        return <div onClick={() => signIn()}>{children}</div>;
    }
    return <SignInButton mode={mode as any}>{children}</SignInButton>;
}

export function AuthUserButton() {
    const { user, signOut } = useAuth();
    if (USE_MOCK_AUTH) {
        return (
            <div className="flex items-center gap-2">
                <img
                    src={user?.imageUrl || "https://ui.shadcn.com/avatars/01.png"}
                    alt="User"
                    className="h-8 w-8 rounded-full border border-gray-200 cursor-pointer"
                    onClick={() => signOut()}
                    title="Kliknij aby wylogować (Mock)"
                />
            </div>
        );
    }
    return <UserButton afterSignOutUrl="/" />;
}
