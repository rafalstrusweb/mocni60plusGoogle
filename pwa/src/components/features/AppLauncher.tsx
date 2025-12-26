import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Mail, MessageCircle, Phone, Globe, MessageSquare, Facebook,
    Edit, Check, Settings, Youtube, Map, CloudSun, Camera, Image,
    Plus, X, Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface AppTile {
    id: string;
    label: string;
    type: string;
    color: string;
    url: string;
    visible: boolean;
}

const DEFAULT_TILES: AppTile[] = [
    { id: 't1', label: 'Telefon', type: 'phone', color: 'bg-green-500', url: 'tel:', visible: true },
    { id: 't2', label: 'SMS', type: 'sms', color: 'bg-blue-400', url: 'sms:', visible: true },
    { id: 't3', label: 'WhatsApp', type: 'whatsapp', color: 'bg-green-600', url: 'https://wa.me/', visible: true },
    { id: 't4', label: 'Facebook', type: 'facebook', color: 'bg-blue-700', url: 'https://facebook.com', visible: true },
    { id: 't5', label: 'Email', type: 'email', color: 'bg-red-500', url: 'mailto:', visible: true },
    { id: 't6', label: 'Internet', type: 'browser', color: 'bg-orange-400', url: 'https://google.com', visible: true },
];

const APP_LIBRARY: Omit<AppTile, 'id' | 'visible'>[] = [
    { label: 'YouTube', type: 'youtube', color: 'bg-red-600', url: 'https://youtube.com' },
    { label: 'Mapy', type: 'maps', color: 'bg-green-600', url: 'https://maps.google.com' },
    { label: 'Kultura', type: 'events', color: 'bg-purple-500', url: '/events' },
    { label: 'Pogoda', type: 'weather', color: 'bg-blue-300', url: 'https://weather.com' },
    { label: 'Zdjęcia', type: 'photos', color: 'bg-yellow-500', url: 'https://photos.google.com' },
    { label: 'Aparat', type: 'camera', color: 'bg-slate-700', url: '/camera' }, // Placeholder logic
];

const ICONS: Record<string, any> = {
    phone: Phone,
    sms: MessageSquare,
    whatsapp: MessageCircle,
    facebook: Facebook,
    email: Mail,
    browser: Globe,
    youtube: Youtube,
    maps: Map,
    weather: CloudSun,
    photos: Image,
    camera: Camera
};

export function AppLauncher() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [tiles, setTiles] = useState<AppTile[]>(DEFAULT_TILES);

    // Load Config
    useEffect(() => {
        const local = localStorage.getItem('launcherConfig');
        if (local) {
            try {
                const config = JSON.parse(local);
                // Merge loaded config, allowing for new/removed tiles
                setTiles(config);
            } catch (e) { console.error("Parse error", e); }
        }

        if (user) {
            const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
                const data = docSnap.data();
                if (data?.launcherConfig) {
                    setTiles(data.launcherConfig);
                }
            }, (error) => console.log("Guest mode or permission error"));
            return () => unsub();
        }
    }, [user]);

    const saveConfig = async (newTiles: AppTile[]) => {
        const config = newTiles;
        localStorage.setItem('launcherConfig', JSON.stringify(config));
        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), { launcherConfig: config }, { merge: true });
            } catch (e) { console.warn("Firestore save failed", e); }
        }
    };

    const changeColor = (id: string, color: string) => {
        const newTiles = tiles.map(t => t.id === id ? { ...t, color } : t);
        setTiles(newTiles);
        saveConfig(newTiles);
    };

    const removeTile = (id: string) => {
        const newTiles = tiles.filter(t => t.id !== id);
        setTiles(newTiles);
        saveConfig(newTiles);
    };

    const addTile = (template: typeof APP_LIBRARY[0]) => {
        const newTile: AppTile = {
            ...template,
            id: `t${Date.now()}`,
            visible: true
        };
        const newTiles = [...tiles, newTile];
        setTiles(newTiles);
        saveConfig(newTiles);
        setIsAddModalOpen(false);
    };

    const COLORS = ['bg-red-500', 'bg-orange-400', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-slate-500'];

    return (
        <section className="space-y-4 py-8 border-t border-border/50 relative">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Settings className="w-6 h-6 text-primary" />
                        Moje Aplikacje
                    </h2>
                    <p className="text-muted-foreground">Twoje centrum sterowania</p>
                </div>
                <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Gotowe' : 'Edytuj'}
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {tiles.map(tile => {
                    const Icon = ICONS[tile.type] || Globe;
                    return (
                        <Card key={tile.id} className={`relative overflow-visible border-0 shadow-md aspect-square flex flex-col items-center justify-center text-white transition-all active:scale-95 ${tile.color}`}>
                            {isEditing && (
                                <button
                                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-lg z-30 hover:bg-red-700 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); removeTile(tile.id); }}
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            )}

                            {isEditing && (
                                <div className="absolute inset-x-0 bottom-0 top-1/2 flex flex-wrap justify-center content-end gap-1 p-1 z-20 bg-gradient-to-t from-black/80 to-transparent">
                                    {COLORS.slice(0, 4).map(c => (
                                        <button key={c} className={`w-3 h-3 rounded-full border border-white ${c}`} onClick={(e) => { e.stopPropagation(); changeColor(tile.id, c); }} />
                                    ))}
                                </div>
                            )}

                            {!isEditing && (
                                <a
                                    href={tile.url}
                                    target={tile.url?.startsWith('http') ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="absolute inset-0 z-10"
                                />
                            )}
                            <Icon className="h-8 w-8 mb-1 drop-shadow-md" />
                            <span className="font-bold text-[10px] md:text-xs drop-shadow-md tracking-wide text-center leading-tight px-1">{tile.label}</span>
                        </Card>
                    );
                })}

                {/* Add Button */}
                {isEditing && (
                    <Card
                        className="relative overflow-hidden border-2 border-dashed border-gray-300 shadow-sm aspect-square flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="h-10 w-10 mb-1" />
                        <span className="font-semibold text-xs">Dodaj</span>
                    </Card>
                )}
            </div>

            {/* Add Modal Overlay */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in backdrop-blur-sm">
                    <Card className="w-full max-w-sm bg-background p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Dodaj aplikację</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {APP_LIBRARY.map(app => {
                                const Icon = ICONS[app.type] || Globe;
                                const isAdded = tiles.some(t => t.type === app.type && t.label === app.label); // Simple check
                                return (
                                    <button
                                        key={app.type}
                                        className={`flex flex-col items-center p-3 rounded-xl transition-colors ${isAdded ? 'opacity-50 grayscale cursor-not-allowed bg-gray-100' : 'hover:bg-accent/10 border border-transparent hover:border-accent'}`}
                                        disabled={isAdded}
                                        onClick={() => addTile(app)}
                                    >
                                        <div className={`p-2 rounded-full ${app.color} text-white mb-2`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold">{app.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}
        </section>
    );
}
