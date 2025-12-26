import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Lock, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logAction } from '@/lib/audit';

export function VerificationPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'redirecting' | 'verifying' | 'success'>('idle');

    const handleVerification = async () => {
        if (!user) return;

        // 1. Simulate Handoff to External Provider (Stateless)
        setStatus('redirecting');

        // Mocking the delay of redirection and external processing
        setTimeout(() => {
            setStatus('verifying');

            // 2. Simulate Callback from Provider (Provider says: "OK")
            setTimeout(async () => {
                try {
                    // 3. We only store the RESULT (bool/enum), never the PII
                    await updateDoc(doc(db, 'users', user.uid), {
                        verificationStatus: 'bank_id_verified'
                    });

                    logAction('VERIFY_IDENTITY', user.uid, 'Identity verified via Mock Provider (mObywatel)');
                    setStatus('success');
                } catch (error) {
                    console.error("Verification callback failed", error);
                    setStatus('idle');
                }
            }, 2000);
        }, 1500);
    };

    if (status === 'success') {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="rounded-full bg-green-100 p-6">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary">Tożsamość Potwierdzona!</h1>
                    <p className="text-muted-foreground text-lg max-w-md">
                        Dziękujemy. Twój profil został oznaczony jako <strong>Zaufany Opiekun</strong>.
                        Teraz masz pełny dostęp do zleceń.
                    </p>
                    <Button size="lg" onClick={() => navigate('/gigs')} className="w-full max-w-xs">
                        Wróć do Zleceń <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </MainLayout>
        );
    }

    if (status === 'redirecting' || status === 'verifying') {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">
                        {status === 'redirecting' ? 'Łączenie z mObywatel...' : 'Weryfikacja danych...'}
                    </h2>
                    <p className="text-muted-foreground">Proszę nie zamykać aplikacji.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-primary">Zaufany Profil</h1>
                    <p className="text-lg text-muted-foreground">
                        Potwierdź swoją tożsamość, aby budować zaufanie wśród seniorów.
                    </p>
                </div>

                <Card className="border-l-4 border-l-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Dlaczego weryfikacja?
                        </CardTitle>
                        <CardDescription className="text-base">
                            W SeniorApp bezpieczeństwo to podstawa. Nie przechowujemy Twoich dokumentów – polegamy na zewnętrznych, certyfikowanych dostawcach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                            <Lock className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-900">Architektura "Data-Light"</h3>
                                <p className="text-sm text-blue-700">
                                    Twoje dane z dowodu osobistego trafiają bezpośrednio do operatora (mObywatel). My otrzymujemy tylko potwierdzenie "TAK/NIE".
                                    <strong> Zero wrażliwych danych na naszych serwerach.</strong>
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                            <Button size="lg" className="h-auto py-4 flex flex-col items-center gap-1 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700" onClick={handleVerification}>
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-6 h-6" />
                                    <span className="text-lg font-bold">mObywatel</span>
                                </div>
                                <span className="text-xs opacity-90 font-normal">Szybka weryfikacja online</span>
                            </Button>

                            <Button size="lg" variant="outline" className="h-auto py-4 flex flex-col items-center gap-1" disabled>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">BankID</span>
                                </div>
                                <span className="text-xs opacity-70 font-normal">Wkrótce dostępne</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Partnerem weryfikacji jest Ministerstwo Cyfryzacji (Symulacja) oraz Veriff.
                </p>
            </div>
        </MainLayout>
    );
}
