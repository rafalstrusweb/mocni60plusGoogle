import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Pill, Activity, Plus, Save, Bell, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db, requestForToken } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { logAction } from '@/lib/audit';

export function HealthPage() {
    const { user } = useAuth();
    // Vitals State
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');

    // Meds State
    const [medName, setMedName] = useState('');
    const [medDosage, setMedDosage] = useState('');
    const [medTime, setMedTime] = useState('08:00');
    const [medDays, setMedDays] = useState<string[]>(['Codziennie']);

    // Lists
    const [vitals, setVitals] = useState<any[]>([]);
    const [meds, setMeds] = useState<any[]>([]);
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

    // AUDIT: Log that user viewed PHI
    useEffect(() => {
        if (user) {
            logAction('VIEW_PHI', user.uid, 'User accessed Health Dashboard');
        }
    }, [user]);

    // Firestore Listeners
    useEffect(() => {
        if (!user) return;

        const qVitals = query(collection(db, `users/${user.uid}/medical_vitals`), orderBy('recordedAt', 'desc'));
        const unsubscribeVitals = onSnapshot(qVitals, (snapshot) => {
            setVitals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qMeds = query(collection(db, `users/${user.uid}/medical_meds`), orderBy('createdAt', 'desc'));
        const unsubscribeMeds = onSnapshot(qMeds, (snapshot) => {
            setMeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeVitals();
            unsubscribeMeds();
        };
    }, [user]);

    const handleEnableNotifications = async () => {
        if (!user) return;
        const token = await requestForToken();
        if (token) {
            // Save token to user profile for backend targeting
            await setDoc(doc(db, `users/${user.uid}/fcmTokens/${token}`), {
                token: token,
                device: navigator.userAgent,
                updatedAt: serverTimestamp()
            });
            setNotificationPermission('granted');
            alert("Powiadomienia włączone! Dziękujemy.");
        } else {
            alert("Nie udało się włączyć powiadomień. Sprawdź ustawienia przeglądarki.");
        }
    };

    const handleSaveVitals = async () => {
        if (!user || !systolic || !diastolic) return;
        await addDoc(collection(db, `users/${user.uid}/medical_vitals`), {
            systolic: Number(systolic), diastolic: Number(diastolic), pulse: Number(pulse) || 0, recordedAt: serverTimestamp()
        });
        await logAction('UPDATE_PHI', user.uid, 'Added vital signs');
        setSystolic(''); setDiastolic(''); setPulse('');
    };

    const handleSaveMed = async () => {
        if (!user || !medName) return;
        await addDoc(collection(db, `users/${user.uid}/medical_meds`), {
            name: medName,
            dosage: medDosage,
            schedule: {
                time: medTime,
                days: medDays
            },
            createdAt: serverTimestamp()
        });
        await logAction('UPDATE_PHI', user.uid, `Added scheduled med: ${medName}`);
        setMedName(''); setMedDosage('');
    };

    return (
        <MainLayout>
            <div className="space-y-6 pb-20">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <Activity className="h-8 w-8 text-red-500" />
                            Mocni w Zdrowiu
                        </h1>
                        <p className="text-muted-foreground text-lg">Twoje bezpieczne centrum zdrowia.</p>
                    </div>
                    {notificationPermission !== 'granted' && (
                        <Button onClick={handleEnableNotifications} variant="outline" className="border-primary text-primary">
                            <Bell className="mr-2 h-4 w-4" /> Włącz Przypomnienia
                        </Button>
                    )}
                </div>

                {/* Vitals Section */}
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Heart className="h-6 w-6 text-red-500" />
                            Ciśnienie i Puls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Skurczowe</label>
                                <Input type="number" placeholder="120" className="text-2xl h-14" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rozkurczowe</label>
                                <Input type="number" placeholder="80" className="text-2xl h-14" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Puls</label>
                                <Input type="number" placeholder="70" className="text-2xl h-14" value={pulse} onChange={(e) => setPulse(e.target.value)} />
                            </div>
                        </div>
                        <Button onClick={handleSaveVitals} className="w-full h-12 text-lg bg-red-600 hover:bg-red-700">
                            <Save className="mr-2 h-5 w-5" /> Zapisz Wynik
                        </Button>
                        <div className="mt-4 space-y-2">
                            {vitals.slice(0, 3).map((v) => (
                                <div key={v.id} className="flex justify-between p-3 bg-secondary/20 rounded-lg">
                                    <span className="font-mono font-bold text-lg">{v.systolic}/{v.diastolic}</span>
                                    <span className="text-muted-foreground">{v.pulse} bpm</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Medications Section (Enhanced) */}
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Pill className="h-6 w-6 text-blue-500" />
                            Plan Leków
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nazwa Leku</label>
                                <Input placeholder="np. Aspiryna" className="h-12 text-lg" value={medName} onChange={(e) => setMedName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dawka</label>
                                <Input placeholder="np. 1 tabletka" className="h-12 text-lg" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} />
                            </div>
                        </div>

                        {/* Schedule Controls */}
                        <div className="flex gap-4 items-end">
                            <div className="space-y-2 flex-1">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Godzina
                                </label>
                                <Input type="time" className="h-12 text-lg" value={medTime} onChange={(e) => setMedTime(e.target.value)} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Dni
                                </label>
                                <div className="h-12 flex items-center px-3 border rounded-md bg-secondary/10">
                                    Codziennie
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSaveMed} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
                            <Bell className="mr-2 h-5 w-5" /> Dodaj Przypomnienie
                        </Button>

                        <div className="mt-4 space-y-3">
                            {meds.map((m) => (
                                <div key={m.id} className="flex justify-between items-center p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg">
                                    <div>
                                        <div className="font-semibold text-lg">{m.name}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="bg-background px-2 py-0.5 rounded border">{m.dosage}</span>
                                            <span>• {m.schedule?.time} (Codziennie)</span>
                                        </div>
                                    </div>
                                    <Bell className="h-5 w-5 text-blue-400" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
