"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMedicationReminders = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// Run every minute
exports.sendMedicationReminders = functions.region('europe-central2')
    .pubsub.schedule('every 1 minutes')
    .timeZone('Europe/Warsaw')
    .onRun(async (context) => {
    const now = new Date();
    const options = {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    // Format: "08:00"
    const timeString = now.toLocaleTimeString('pl-PL', options);
    console.log(`Checking reminders for time: ${timeString}`);
    try {
        // Collection Group Query: Find all meds with schedule.time == now
        // Requires Index: medical_meds / schedule.time ASC
        const medsSnapshot = await db.collectionGroup('medical_meds')
            .where('schedule.time', '==', timeString)
            .get();
        if (medsSnapshot.empty) {
            console.log('No meds scheduled for now.');
            return null;
        }
        console.log(`Found ${medsSnapshot.size} meds due.`);
        const promises = [];
        for (const doc of medsSnapshot.docs) {
            const medData = doc.data();
            // const days = medData.schedule?.days || [];
            // TODO: Check Day of week here if not "Codziennie"
            // Navigate to Parent User (med is in medical_meds collection under user)
            // structure: users/{uid}/medical_meds/{medID}
            const userRef = doc.ref.parent.parent;
            if (!userRef) {
                console.log('Orphaned med doc:', doc.id);
                continue;
            }
            const uid = userRef.id;
            // fetch tokens
            const tokensSnap = await db.collection(`users/${uid}/fcmTokens`).get();
            if (tokensSnap.empty) {
                console.log(`No tokens for user ${uid}`);
                continue;
            }
            const tokens = tokensSnap.docs.map(d => d.id);
            const payload = {
                notification: {
                    title: 'Czas na leki! 💊',
                    body: `Przypomnienie: ${medData.name} (${medData.dosage})`
                },
                webpush: {
                    fcmOptions: {
                        link: '/health'
                    },
                    notification: {
                        icon: '/pwa-192x192.png'
                    }
                },
                tokens: tokens
            };
            promises.push(admin.messaging().sendMulticast(payload));
        }
        const results = await Promise.all(promises);
        console.log(`Sent ${results.length} notifications successfully.`);
        return null;
    }
    catch (error) {
        console.error('Error sending reminders:', error);
        return null;
    }
});
//# sourceMappingURL=index.js.map