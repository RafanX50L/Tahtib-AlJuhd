export interface PaymentSession {
  sessionId: string;
  userId: string;
  trainerId: string;
  planId: string;
  amount: number;
  currency: string;
  timestamp: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'expired';
}

const SESSION_KEY = 'activePaymentSession';
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export const paymentSessionManager = {
  getActiveSession(): PaymentSession | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    try {
      const session: PaymentSession = JSON.parse(sessionStr);
      const now = Date.now();

      // Check expiry
      if (now - session.timestamp > EXPIRY_MS) {
        this.clearSession();
        return null;
      }

      // Only return if active/pending
      if (['active', 'pending'].includes(session.status)) {
        return session;
      }

      // Auto-clear completed/cancelled/expired
      if (['completed', 'cancelled', 'expired'].includes(session.status)) {
        this.clearSession();
      }

      return null;
    } catch (err) {
      console.error('Invalid session in storage:', err);
      this.clearSession();
      return null;
    }
  },

  hasActiveSession(): boolean {
    return this.getActiveSession() !== null;
  },

  createSession(sessionData: Omit<PaymentSession, 'timestamp' | 'status'>): PaymentSession {
    const session: PaymentSession = {
      ...sessionData,
      timestamp: Date.now(),
      status: 'active' as const,
    };

    // Notify other tabs of new session (custom event for immediate sync)
    window.dispatchEvent(new CustomEvent('payment-session-created', { detail: session }));

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  updateSessionStatus(status: PaymentSession['status']): void {
    const session = this.getActiveSession();
    if (!session) return;

    const updatedSession: PaymentSession = { ...session, status };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

    // Notify other tabs
    window.dispatchEvent(new CustomEvent('payment-status-updated', { detail: { sessionId: session.sessionId, status } }));
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    // Notify other tabs
    window.dispatchEvent(new CustomEvent('payment-session-cleared'));
  },
};