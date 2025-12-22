import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Map, Heart, Users } from 'lucide-react';
import { gigs, trips } from '@/lib/mockData';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            {/* Welcome Section */}
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Dzień dobry, Janino!</h1>
                <p className="text-xl text-muted-foreground">Co chciałabyś dzisiaj zrobić?</p>
            </section>

            {/* Quick Actions - Large Touch Targets */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card
                    className="group cursor-pointer border-2 hover:border-accent transition-colors active:scale-95"
                    onClick={() => navigate('/gigs')}
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="rounded-full bg-blue-100 p-4 group-hover:bg-accent/20">
                            <Briefcase className="h-8 w-8 text-primary group-hover:text-accent" />
                        </div>
                        <span className="font-semibold text-lg text-center">Praca</span>
                    </CardContent>
                </Card>

                <Card
                    className="group cursor-pointer border-2 hover:border-accent transition-colors active:scale-95"
                    onClick={() => navigate('/travel')}
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="rounded-full bg-green-100 p-4 group-hover:bg-accent/20">
                            <Map className="h-8 w-8 text-success group-hover:text-accent" />
                        </div>
                        <span className="font-semibold text-lg text-center">Podróże</span>
                    </CardContent>
                </Card>

                <Card
                    className="group cursor-pointer border-2 hover:border-accent transition-colors active:scale-95"
                    onClick={() => navigate('/community')}
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="rounded-full bg-orange-100 p-4 group-hover:bg-accent/20">
                            <Users className="h-8 w-8 text-orange-600 group-hover:text-accent" />
                        </div>
                        <span className="font-semibold text-lg text-center">Ludzie</span>
                    </CardContent>
                </Card>

                <Card
                    className="group cursor-pointer border-2 hover:border-accent transition-colors active:scale-95"
                    onClick={() => navigate('/health')}
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="rounded-full bg-pink-100 p-4 group-hover:bg-accent/20">
                            <Heart className="h-8 w-8 text-pink-600 group-hover:text-accent" />
                        </div>
                        <span className="font-semibold text-lg text-center">Zdrowie</span>
                    </CardContent>
                </Card>
            </section>

            {/* Recommendations - Horizontal Scroll on Mobile */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Polecane dla Ciebie</h2>
                    <Button variant="link" className="text-lg">Zobacz więcej</Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {/* Gig Card */}
                    {gigs.slice(0, 1).map(gig => (
                        <Card key={gig.id} className="min-w-[300px] snap-center">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-primary">
                                        Praca dorywcza
                                    </span>
                                    <span className="font-bold text-xl text-primary">{gig.price} {gig.currency}</span>
                                </div>
                                <h3 className="text-xl font-bold">{gig.title}</h3>
                                <p className="text-muted-foreground line-clamp-2">{gig.description}</p>
                                <Button className="w-full mt-2" variant="outline">Szczegóły</Button>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Trip Card */}
                    {trips.slice(0, 1).map(trip => (
                        <Card key={trip.id} className="min-w-[300px] snap-center">
                            <div className="h-32 w-full overflow-hidden rounded-t-3xl">
                                <img src={trip.imageUrl} alt={trip.title} className="h-full w-full object-cover" />
                            </div>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-success">
                                        Wycieczka
                                    </span>
                                    <span className="font-bold text-xl text-primary">{trip.price} PLN</span>
                                </div>
                                <h3 className="text-xl font-bold line-clamp-1">{trip.title}</h3>
                                <p className="text-muted-foreground">{trip.date}</p>
                                <Button className="w-full mt-2" variant="outline">Szczegóły</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
