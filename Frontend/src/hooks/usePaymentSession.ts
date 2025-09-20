import { useState, useEffect, useCallback } from 'react';
import { paymentSessionManager, PaymentSession } from '../utils/paymentSessionManager';

interface UsePaymentSessionReturn {
  hasActiveSession: boolean;
  currentSession: PaymentSession | null;
  createSession: (sessionData: Omit<PaymentSession, 'timestamp' | 'status'>) => PaymentSession;
  updateSessionStatus: (status: PaymentSession['status']) => void;
  clearSession: () => void;
  isLoading: boolean;
  error: string | null;
}

export const usePaymentSession = (): UsePaymentSessionReturn => {
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [currentSession, setCurrentSession] = useState<PaymentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session state
  useEffect(() => {
    try {
      const session = paymentSessionManager.getActiveSession();
      setCurrentSession(session);
      setHasActiveSession(!!session);
    } catch (err) {
      setError('Failed to initialize payment session');
      console.error('Payment session initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activePaymentSession') {
        const session = paymentSessionManager.getActiveSession();
        setCurrentSession(session);
        setHasActiveSession(!!session);
        setError(null); // Clear any stale errors
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events (faster sync)
  useEffect(() => {
    const handleSessionCreated = (event: CustomEvent<PaymentSession>) => {
      setCurrentSession(event.detail);
      setHasActiveSession(true);
    };

    const handleStatusUpdated = (event: CustomEvent<{ sessionId: string; status: PaymentSession['status'] }>) => {
      setCurrentSession(prev => prev ? { ...prev, status: event.detail.status } : null);
      if (['completed', 'cancelled'].includes(event.detail.status)) {
        setTimeout(() => {
          setCurrentSession(null);
          setHasActiveSession(false);
        }, 500); // Short delay for UI feedback
      }
    };

    const handleSessionCleared = () => {
      setCurrentSession(null);
      setHasActiveSession(false);
      setError(null);
    };

    window.addEventListener('payment-session-created', handleSessionCreated as EventListener);
    window.addEventListener('payment-status-updated', handleStatusUpdated as EventListener);
    window.addEventListener('payment-session-cleared', handleSessionCleared);

    return () => {
      window.removeEventListener('payment-session-created', handleSessionCreated as EventListener);
      window.removeEventListener('payment-status-updated', handleStatusUpdated as EventListener);
      window.removeEventListener('payment-session-cleared', handleSessionCleared);
    };
  }, []);

  // Listen for multiple tabs warning (if implemented elsewhere)
  useEffect(() => {
    const handleMultipleTabs = (event: CustomEvent) => {
      setError(event.detail.message);
      setTimeout(() => setError(null), 5000);
    };

    window.addEventListener('payment-multiple-tabs', handleMultipleTabs as EventListener);
    return () => window.removeEventListener('payment-multiple-tabs', handleMultipleTabs as EventListener);
  }, []);

  const createSession = useCallback((sessionData: Omit<PaymentSession, 'timestamp' | 'status'>) => {
    try {
      setError(null);
      if (paymentSessionManager.hasActiveSession()) {
        throw new Error('A payment session is already active. Please complete or cancel the existing payment before starting a new one.');
      }
      const session = paymentSessionManager.createSession(sessionData);
      setCurrentSession(session);
      setHasActiveSession(true);
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment session';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateSessionStatus = useCallback((status: PaymentSession['status']) => {
    try {
      paymentSessionManager.updateSessionStatus(status);
      setCurrentSession(prev => prev ? { ...prev, status } : null);
      
      // Immediately clear state for non-active statuses (manager will handle storage)
      if (['completed', 'cancelled', 'expired'].includes(status)) {
        setCurrentSession(null);
        setHasActiveSession(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating session status:', err);
      setError('Failed to update payment status');
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      paymentSessionManager.clearSession();
      setCurrentSession(null);
      setHasActiveSession(false);
      setError(null);
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  }, []);

  return {
    hasActiveSession,
    currentSession,
    createSession,
    updateSessionStatus,
    clearSession,
    isLoading,
    error
  };
};