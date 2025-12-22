import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gigs } from '@/lib/mockData';
import { MapPin, ShieldCheck, Clock } from 'lucide-react';

export function GigsPage() {
    return (
        <MainLayout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">Mocni w Pracy</h1>
                <p className="text-muted-foreground text-lg">Znajdź dodatkowe zajęcie w Twojej okolicy.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {['Wszystkie', 'Naprawy', 'Opieka', 'Ogród', 'Tech'].map((cat, i) => (
                    <Button key={cat} variant={i === 0 ? 'default' : 'outline'} size="sm" className="rounded-full">
                        {cat}
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {gigs.map((gig) => (
                    <Card key={gig.id} className="overflow-hidden border-l-4 border-l-primary/50">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-base font-medium text-muted-foreground uppercase tracking-wide">{gig.category}</span>
                                        {gig.urgent && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">PILNE</span>}
                                    </div>
                                    <CardTitle className="leading-snug">{gig.title}</CardTitle>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-primary">{gig.price} zł</span>
                                    {gig.isInsured && (
                                        <div className="flex items-center justify-end gap-1 text-success text-xs font-medium mt-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Ubezpieczone</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-foreground text-lg">{gig.description}</p>

                            <div className="flex flex-col gap-2 text-base text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    <span>{gig.location.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span>Dodano: Dzisiaj, 10:00</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                    <img src={gig.author.avatar} alt={gig.author.name} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{gig.author.name}</p>
                                    <p className="text-base text-muted-foreground">{gig.author.district}</p>
                                </div>
                                <Button className="ml-auto" size="default">Zgłoś się</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
}
