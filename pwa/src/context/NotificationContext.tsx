import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    addDoc,
    deleteDoc,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export interface Notification {
    id: string;
    type: 'job' | 'travel' | 'community' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
    createdAt?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => Promise<void>;
    removeNotification: (id: string) => Promise<void>;
    simulateNotification: () => Promise<void>; // For testing
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();

    // Subscribe to notifications when user is logged in
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const q = query(
            collection(db, `users/${user.uid}/notifications`),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs: Notification[] = snapshot.docs.map(doc => {
                const data = doc.data();
                // Convert timestamp to readable string
                let time = 'teraz';
                if (data.createdAt) {
                    const date = data.createdAt.toDate();
                    const now = new Date();
                    const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes

                    if (diff < 1) time = 'teraz';
                    else if (diff < 60) time = `${diff} min temu`;
                    else if (diff < 1440) time = `${Math.floor(diff / 60)} godz. temu`;
                    else time = 'wczoraj'; // Simplified logic
                }

                return {
                    id: doc.id,
                    ...data,
                    time,
                } as Notification;
            });
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id: string) => {
        if (!user) return;
        const notifRef = doc(db, `users/${user.uid}/notifications`, id);
        await updateDoc(notifRef, { read: true });
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const batch = writeBatch(db);
        const unreadNotifs = notifications.filter(n => !n.read);

        unreadNotifs.forEach(n => {
            const notifRef = doc(db, `users/${user.uid}/notifications`, n.id);
            batch.update(notifRef, { read: true });
        });

        await batch.commit();
    };

    const addNotification = async (notification: Omit<Notification, 'id' | 'read' | 'time'>) => {
        if (!user) return;
        await addDoc(collection(db, `users/${user.uid}/notifications`), {
            ...notification,
            read: false,
            createdAt: serverTimestamp(),
        });
    };

    const removeNotification = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.uid}/notifications`, id));
    };

    // Helper for testing
    const simulateNotification = async () => {
        if (!user) return;
        const types: Notification['type'][] = ['job', 'travel', 'community', 'system'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const mocks = {
            job: { title: 'Nowa oferta pracy', message: 'Opieka nad seniorem - 25zł/h', link: '/gigs' },
            travel: { title: 'Last minute', message: 'Wycieczka do Krakowa -50%', link: '/travel' },
            community: { title: 'Nowy post', message: 'Ktoś skomentował Twój post', link: '/community' },
            system: { title: 'Aktualizacja', message: 'Dodaliśmy nowe funkcje w aplikacji', link: '/' }
        };

        const mock = mocks[randomType];

        await addNotification({
            type: randomType,
            title: mock.title,
            message: mock.message,
            link: mock.link
        });
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification,
            removeNotification,
            simulateNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
