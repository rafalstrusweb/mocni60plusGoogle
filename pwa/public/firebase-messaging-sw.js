// Scripts for firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// This is required for the service worker to know which project to connect to.
// NOTE: Ideally these should be environment variables, but Service Workers don't access process.env easily.
// Using the config from .env.local (Sender ID: 1062789097798)
firebase.initializeApp({
    apiKey: "AIzaSyCVyQfzDdLccFEzeW1vFv1KXkJToMTo4e8",
    authDomain: "mocni60-b42e9.firebaseapp.com",
    projectId: "mocni60-b42e9",
    storageBucket: "mocni60-b42e9.firebasestorage.app",
    messagingSenderId: "1062789097798",
    appId: "1:1062789097798:web:ad1ebbae104177c6b7dd47"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pwa-192x192.png' // Ensure this icon exists
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
