/**
 * Payment Session Manager
 * Prevents users from accessing the same payment page in multiple tabs
 */

export interface PaymentSession {
  sessionId: string;
  userId: string;
  trainerId?: string;
  planId?: string;
  amount: number;
  currency: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
}

class PaymentSessionManager {
  private readonly STORAGE_KEY = 'activePaymentSession';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly TAB_ID_KEY = 'paymentTabId';

  /**
   * Check if there's an active payment session
   */
  hasActiveSession(): boolean {
    const session = this.getActiveSession();
    if (!session) return false;

    // Check if session has expired
    if (this.isSessionExpired(session)) {
      this.clearSession();
      return false;
    }

    return session.status === 'pending';
  }

  /**
   * Get the current active payment session
   */
  getActiveSession(): PaymentSession | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      if (!sessionData) return null;

      const session: PaymentSession = JSON.parse(sessionData);
      return session;
    } catch (error) {
      console.error('Error reading payment session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Create a new payment session
   */
  createSession(sessionData: Omit<PaymentSession, 'timestamp' | 'status'>): PaymentSession {
    const session: PaymentSession = {
      ...sessionData,
      timestamp: Date.now(),
      status: 'pending'
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      
      // Generate unique tab ID for this payment session
      const tabId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.TAB_ID_KEY, tabId);

      // Set up storage event listener to detect other tabs
      this.setupTabCommunication();

      console.log('Payment session created:', session.sessionId);
      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw new Error('Failed to create payment session');
    }
  }

  /**
   * Update session status
   */
  updateSessionStatus(status: PaymentSession['status']): void {
    const session = this.getActiveSession();
    if (!session) return;

    session.status = status;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));

    // If payment is completed or cancelled, clear the session after a delay
    if (status === 'completed' || status === 'cancelled') {
      setTimeout(() => {
        this.clearSession();
      }, 5000); // Clear after 5 seconds
    }
  }

  /**
   * Clear the current payment session
   */
  clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TAB_ID_KEY);
    console.log('Payment session cleared');
  }

  /**
   * Check if session has expired
   */
  private isSessionExpired(session: PaymentSession): boolean {
    return Date.now() - session.timestamp > this.SESSION_TIMEOUT;
  }

  /**
   * Set up communication between tabs
   */
  private setupTabCommunication(): void {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        // Another tab has created a payment session
        this.handleMultipleTabs();
      }
    });

    // Listen for beforeunload to clean up
    window.addEventListener('beforeunload', () => {
      const session = this.getActiveSession();
      if (session && session.status === 'pending') {
        // Don't clear immediately, let the timeout handle it
        // This prevents race conditions
      }
    });
  }

  /**
   * Handle multiple tabs trying to access payment
   */
  private handleMultipleTabs(): void {
    const currentTabId = localStorage.getItem(this.TAB_ID_KEY);
    const session = this.getActiveSession();
    
    if (session && currentTabId) {
      // Show warning to user
      this.showMultipleTabsWarning();
    }
  }

  /**
   * Show warning about multiple tabs
   */
  private showMultipleTabsWarning(): void {
    // You can customize this based on your UI framework
    const warningMessage = 'Another payment session is already active in another tab. Please complete or cancel that payment before starting a new one.';
    
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('payment-multiple-tabs', {
      detail: { message: warningMessage }
    }));

    // Also show browser alert as fallback
    alert(warningMessage);
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo(): { hasActive: boolean; session: PaymentSession | null; tabId: string | null } {
    return {
      hasActive: this.hasActiveSession(),
      session: this.getActiveSession(),
      tabId: localStorage.getItem(this.TAB_ID_KEY)
    };
  }
}

// Export singleton instance
export const paymentSessionManager = new PaymentSessionManager();