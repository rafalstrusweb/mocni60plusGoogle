import { User, Gig, Trip, CommunityGroup, OfflineEvent, CourseModule } from '@/types/core';

export const currentUser: User = {
    id: 'u1',
    name: 'Janina Kowalska',
    avatar: 'https://ui.shadcn.com/avatars/04.png',
    role: 'senior',
    verificationStatus: 'bank_id_verified',
    district: 'Poznań - Jeżyce',
    badges: ['Super Sąsiad', 'Mistrzyni Ciast'],
};

export const gigs: Gig[] = [
    {
        id: 'g1',
        category: 'tech',
        title: 'Pomoc w obsłudze smartfona',
        description: 'Potrzebuję pomocy z ustawieniem WhatsAppa, aby dzwonić do wnuczka.',
        price: 50,
        currency: 'PLN',
        location: { address: 'Dąbrowskiego 15, Jeżyce', lat: 52.411, lng: 16.909 },
        isInsured: true,
        urgent: true,
        author: {
            id: 'u2',
            name: 'Tadeusz Nowak',
            avatar: 'https://ui.shadcn.com/avatars/02.png',
            role: 'senior',
            verificationStatus: 'bank_id_verified',
            district: 'Poznań - Grunwald',
            badges: [],
        },
        createdAt: '2025-12-20T10:00:00Z',
    },
    {
        id: 'g2',
        category: 'garden',
        title: 'Przycięcie róż na działce',
        description: 'Mam 10 krzaków róż do przycięcia. Zapewniam narzędzia.',
        price: 150,
        currency: 'PLN',
        location: { address: 'ROD "Relaks", Strzeszyn', lat: 52.450, lng: 16.850 },
        isInsured: false,
        urgent: false,
        author: currentUser,
        createdAt: '2025-12-19T14:30:00Z',
        imageUrl: '/images/garden.png'
    }
];

export const trips: Trip[] = [
    {
        id: 't1',
        title: 'Ciechocinek - Wiosna dla Seniora',
        destination: 'Ciechocinek',
        date: '2026-03-15',
        price: 1200,
        matchmakingAvailable: true,
        accessibilityTags: ['Winda', 'Płaski teren', 'Dieta lekkostrawna'],
        imageUrl: '/images/ciechocinek.png',
    },
    {
        id: 't2',
        title: 'Wycieczka do Palmiarni Poznańskiej',
        destination: 'Poznań',
        date: '2026-01-20',
        price: 45,
        matchmakingAvailable: true,
        accessibilityTags: ['Winda', 'Klimatyzacja'],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Palmiarnia_Poznanska_-_wnetrze_10.jpg/1200px-Palmiarnia_Poznanska_-_wnetrze_10.jpg',
    }
];

export const communityGroups: CommunityGroup[] = [
    {
        id: 'cg1',
        name: 'Kawiarenka Literacka - Wilda',
        type: 'hobby',
        moderatedByAI: true,
        memberCount: 45,
    },
    {
        id: 'cg2',
        name: 'Wsparcie w cukrzycy',
        type: 'support',
        moderatedByAI: true,
        memberCount: 120,
    }
];

export const offlineEvents: OfflineEvent[] = [
    {
        id: 'e1',
        title: 'Klub Kolacyjny: Pierogi bez tajemnic',
        date: '2025-12-28T17:00:00',
        location: 'Restauracja "Pyra Bar", Strzelecka 13',
        attendeesCount: 8,
    }
];

export const courseModules: CourseModule[] = [
    {
        id: 'cm1',
        title: 'Moduł 1: Bezpieczny Internet',
        lessonsCount: 5,
        progress: 80,
        isCompleted: false,
    },
    {
        id: 'cm2',
        title: 'Moduł 2: Bankowość Online',
        lessonsCount: 4,
        progress: 0,
        isCompleted: false,
    }
];
