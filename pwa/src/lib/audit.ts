import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type AuditAction = 'LOGIN' | 'LOGOUT' | 'VIEW_PHI' | 'UPDATE_PHI' | 'EXPORT_DATA' | 'VIEW_PAGE';

export interface AuditLogEntry {
    action: AuditAction;
    userId: string;
    targetId?: string;
    details?: string;
    userAgent: string;
    timestamp?: any;
}

/**
 * Logs a sensitive action to the audit_logs collection.
 * Required for HIPAA/RODO accounting of disclosures.
 */
export const logAction = async (
    action: AuditAction,
    userId: string,
    details?: string,
    targetId?: string
) => {
    try {
        await addDoc(collection(db, 'audit_logs'), {
            action,
            userId,
            targetId: targetId || null,
            details: details || null,
            userAgent: navigator.userAgent,
            timestamp: serverTimestamp(),
        });
        console.log(`[AUDIT] ${action} logged for user ${userId}`);
    } catch (error) {
        console.error('[AUDIT] Failed to log action:', error);
        // In a real HIPAA/critical system, you might want to block the action if logging fails.
        // For MVP/UX redundancy, we allow it but log the error locally.
    }
};
