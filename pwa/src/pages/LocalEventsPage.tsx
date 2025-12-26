import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchMuseums, Museum } from '@/lib/daneGovPl';
import { MapPin, Calendar, ExternalLink, ArrowLeft, Filter } from 'lucide-react';

export function LocalEventsPage() {
    const navigate = useNavigate();
    const [museums, setMuseums] = useState<Museum[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterFreeOnly, setFilterFreeOnly] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchMuseums();
                setMuseums(data);
            } catch (err) {
                console.error("Failed to fetch museums", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredMuseums = filterFreeOnly
        ? museums.filter(m => !m.freeDay.includes('Brak'))
        : museums;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Wróć do pulpitu
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Kultura i Muzea</h1>
                        <p className="text-muted-foreground mt-2">
                            Odkryj muzea z darmowym wstępem w Twojej okolicy.
                        </p>
                    </div>

                    <Button
                        variant={filterFreeOnly ? "default" : "outline"}
                        onClick={() => setFilterFreeOnly(!filterFreeOnly)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        {filterFreeOnly ? "Pokaż wszystkie" : "Darmowe wejścia"}
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMuseums.map((museum) => (
                            <Card key={museum.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Left: Info */}
                                        <div className="flex-1 p-6">
                                            <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1">
                                                {museum.name}
                                            </h3>

                                            <div className="flex items-start gap-2 text-muted-foreground mb-3">
                                                <MapPin className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                                <span className="text-sm">{museum.address}, {museum.city}</span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4 bg-green-50 text-green-800 px-3 py-2 rounded-lg w-fit">
                                                <Calendar className="h-5 w-5 text-green-600" />
                                                <span className="font-semibold text-sm">
                                                    Darmowy wstęp: {museum.freeDay}
                                                </span>
                                            </div>

                                            <a
                                                href={museum.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-primary text-sm font-medium hover:underline"
                                            >
                                                Strona internetowa
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Dane pochodzą z portalu dane.gov.pl (Państwowy Rejestr Muzeów).
                </p>
            </div>
        </div>
    );
}
