export type UserVerificationStatus = 'unverified' | 'phone_verified' | 'bank_id_verified' | 'trusted_partner';

export interface User {
    id: string;
    name: string;
    avatar: string;
    role: 'senior' | 'student' | 'admin';
    verificationStatus: UserVerificationStatus;
    district: string; // np. 'Poznań - Jeżyce'
    badges: string[]; // Gamification
}

export interface Gig {
    id: string;
    category: 'repair' | 'cleaning' | 'tech' | 'care' | 'cooking' | 'garden';
    title: string;
    description: string;
    price: number;
    currency: 'PLN';
    location: { address: string; lat: number; lng: number };
    isInsured: boolean; // Ikona Tarczy
    urgent: boolean;
    author: User;
    createdAt: string;
}

export interface Trip {
    id: string;
    title: string;
    destination: string;
    date: string;
    price: number;
    matchmakingAvailable: boolean; // "Szukam współlokatora"
    accessibilityTags: string[]; // np. 'Winda', 'Płaski teren'
    imageUrl: string;
}

export interface CommunityGroup {
    id: string; // 'Kawiarenki'
    name: string;
    type: 'hobby' | 'support';
    moderatedByAI: boolean;
    memberCount: number;
}

export interface OfflineEvent { // 'Spotkania'
    id: string;
    title: string; // np. 'Klub Kolacyjny'
    date: string;
    location: string;
    attendeesCount: number;
}

export interface DatingProfile { // 'Poznajmy się'
    userId: string;
    lookingFor: 'friendship' | 'activity_partner'; // Slow Dating
    bio: string;
    interests: string[];
}

export interface CourseModule {
    id: string;
    title: string; // np. 'Moduł 1: Bezpieczny Internet'
    lessonsCount: number;
    progress: number; // 0-100
    isCompleted: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    certified: boolean;
    imageUrl: string;
}

export interface HealthMetric {
    type: 'steps' | 'pressure';
    value: string;
    date: string;
}
