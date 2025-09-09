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

/**
 * Hook for managing payment sessions
 * Prevents multiple payment tabs and provides session management
 */
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
      setHasActiveSession(paymentSessionManager.hasActiveSession());
    } catch (err) {
      setError('Failed to initialize payment session');
      console.error('Payment session initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for multiple tabs warning
  useEffect(() => {
    const handleMultipleTabs = (event: CustomEvent) => {
      setError(event.detail.message);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    };

    window.addEventListener('payment-multiple-tabs', handleMultipleTabs as EventListener);

    return () => {
      window.removeEventListener('payment-multiple-tabs', handleMultipleTabs as EventListener);
    };
  }, []);

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activePaymentSession') {
        const session = paymentSessionManager.getActiveSession();
        setCurrentSession(session);
        setHasActiveSession(paymentSessionManager.hasActiveSession());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const createSession = useCallback((sessionData: Omit<PaymentSession, 'timestamp' | 'status'>) => {
    try {
      setError(null);
      
      // Check if there's already an active session
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
      
      if (status === 'completed' || status === 'cancelled') {
        // Clear session after a short delay
        setTimeout(() => {
          setHasActiveSession(false);
          setCurrentSession(null);
        }, 1000);
      }
    } catch (err) {
      console.error('Error updating session status:', err);
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
