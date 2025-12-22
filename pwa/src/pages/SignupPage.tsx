import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export function SignupPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const passwordRequirements = [
        { met: password.length >= 8, text: 'Minimum 8 znaków' },
        { met: /[A-Z]/.test(password), text: 'Jedna wielka litera' },
        { met: /[0-9]/.test(password), text: 'Jedna cyfra' },
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Hasła nie są takie same');
            return;
        }

        if (!allRequirementsMet) {
            setError('Hasło nie spełnia wymagań');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, displayName);
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Ten adres email jest już zarejestrowany');
            } else if (err.code === 'auth/weak-password') {
                setError('Hasło jest za słabe');
            } else {
                setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
            setError('Wystąpił błąd podczas rejestracji przez Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mx-auto">
                        M
                    </div>
                    <CardTitle className="text-3xl text-primary">Dołącz do Mocni60+</CardTitle>
                    <p className="text-lg text-muted-foreground">Utwórz swoje konto</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 text-lg">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="displayName" className="text-lg font-medium">
                                Imię i nazwisko
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                <Input
                                    id="displayName"
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Jan Kowalski"
                                    className="pl-14 h-16 text-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-lg font-medium">
                                Adres email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jan.kowalski@email.pl"
                                    className="pl-14 h-16 text-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-lg font-medium">
                                Hasło
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-14 pr-14 h-16 text-lg"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                </button>
                            </div>

                            {/* Password requirements */}
                            <div className="space-y-1 pt-2">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {req.met ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/50" />
                                        )}
                                        <span className={`text-base ${req.met ? 'text-green-700' : 'text-muted-foreground'}`}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-lg font-medium">
                                Potwierdź hasło
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-14 h-16 text-lg"
                                    required
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-600 text-base">Hasła nie są takie same</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-card px-4 text-lg text-muted-foreground">lub</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                    >
                        <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Zarejestruj przez Google
                    </Button>

                    <p className="text-center text-lg text-muted-foreground">
                        Masz już konto?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Zaloguj się
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
