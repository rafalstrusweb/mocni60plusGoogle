import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trips } from '@/lib/mockData';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';

export function TravelPage() {
    return (
        <MainLayout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">Mocni w Podróży</h1>
                <p className="text-muted-foreground text-lg">Odkrywaj świat w dobrym towarzystwie.</p>
            </div>

            <div className="space-y-6">
                {trips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden group">
                        <div className="relative h-48 w-full overflow-hidden">
                            <img src={trip.imageUrl} alt={trip.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-primary shadow-sm">
                                {trip.price} PLN
                            </div>
                        </div>

                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{trip.title}</h2>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span>{trip.date}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {trip.accessibilityTags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-base font-medium">
                                        <CheckCircle2 className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>

                            {trip.matchmakingAvailable && (
                                <div className="bg-orange-50 p-3 rounded-lg flex items-center gap-3 border border-orange-100">
                                    <Users className="w-6 h-6 text-orange-500" />
                                    <div>
                                        <p className="font-semibold text-orange-900 text-sm">Szukasz towarzystwa?</p>
                                        <p className="text-sm text-orange-800">Możemy połączyć Cię z osobą z Twojej okolicy.</p>
                                    </div>
                                </div>
                            )}

                            <Button className="w-full" size="lg">Rezerwuję</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
}
