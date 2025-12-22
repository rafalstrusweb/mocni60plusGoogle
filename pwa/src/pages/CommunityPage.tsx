import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { communityGroups, offlineEvents } from '@/lib/mockData';
import { Users, Calendar, HeartHandshake, ShieldCheck } from 'lucide-react';

export function CommunityPage() {
    return (
        <MainLayout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">Mocna Społeczność</h1>
                <p className="text-muted-foreground text-lg">Poznaj sąsiadów i dziel się pasjami.</p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="text-primary w-6 h-6" /> Grupy Tematyczne
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {communityGroups.map(group => (
                        <Card key={group.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                {group.moderatedByAI && (
                                    <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" /> Bezpieczna Moderacja
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Typ: {group.type === 'hobby' ? 'Hobby' : 'Wsparcie'} • {group.memberCount} członków
                                </p>
                                <Button variant="outline" size="sm" className="w-full">Dołącz</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-4 pt-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="text-primary w-6 h-6" /> Nadchodzące Spotkania
                </h2>
                {offlineEvents.map(event => (
                    <Card key={event.id}>
                        <CardContent className="p-4 flex gap-4 items-center">
                            <div className="flex-shrink-0 bg-blue-50 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-primary font-bold">
                                <span className="text-lg">28</span>
                                <span className="text-xs uppercase">GRU</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <p className="text-muted-foreground text-sm">{event.location}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-auto">
                                <HeartHandshake className="w-6 h-6" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white text-center space-y-4 mt-6">
                <h2 className="text-2xl font-bold">Poznajmy się!</h2>
                <p>Szukasz przyjaźni lub partnera na spacer? Nasz system bezpiecznie łączy ludzi.</p>
                <Button variant="secondary" size="lg" className="w-full text-rose-600 font-bold">
                    Utwórz profil
                </Button>
            </div>

        </MainLayout>
    );
}
