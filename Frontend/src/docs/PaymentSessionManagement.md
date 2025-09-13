# Payment Session Management System

This system prevents users from accessing the same payment page in multiple tabs, ensuring a secure and consistent payment experience.

## Features

- **Multi-tab Prevention**: Blocks users from opening multiple payment sessions simultaneously
- **Session Tracking**: Tracks active payment sessions with expiration (30 minutes)
- **Cross-tab Communication**: Detects when users try to open payment in multiple tabs
- **Automatic Cleanup**: Clears sessions after completion, cancellation, or expiration
- **Visual Indicators**: Shows users when a payment session is active
- **Error Handling**: Provides clear error messages for session conflicts

## Components

### 1. PaymentSessionManager (`Frontend/src/utils/paymentSessionManager.ts`)

Core utility class that manages payment sessions:

```typescript
interface PaymentSession {
  sessionId: string;
  userId: string;
  trainerId?: string;
  planId?: string;
  amount: number;
  currency: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
}
```

**Key Methods:**
- `hasActiveSession()`: Check if there's an active payment session
- `createSession()`: Create a new payment session
- `updateSessionStatus()`: Update session status
- `clearSession()`: Clear the current session

### 2. usePaymentSession Hook (`Frontend/src/hooks/usePaymentSession.ts`)

React hook for easy integration with components:

```typescript
const {
  hasActiveSession,
  currentSession,
  createSession,
  updateSessionStatus,
  clearSession,
  isLoading,
  error
} = usePaymentSession();
```

### 3. Updated Payment Flow (`Frontend/src/components/client/Trainer/CATrainerDetails.tsx`)

The trainer details component now includes:
- Payment session validation before creating new sessions
- Visual indicators for active sessions
- Error handling for session conflicts
- Automatic cleanup on payment completion/cancellation

## How It Works

### 1. Session Creation
When a user initiates a payment:
1. System checks for existing active sessions
2. If no active session exists, creates a new one
3. Stores session data in localStorage
4. Sets up cross-tab communication listeners

### 2. Multi-tab Detection
- Uses `localStorage` events to detect when other tabs create sessions
- Shows warning messages when multiple tabs attempt payment
- Prevents new session creation if one is already active

### 3. Session Management
- Sessions expire after 30 minutes of inactivity
- Automatic cleanup on payment completion/cancellation
- Manual cleanup option for users

### 4. Visual Feedback
- Yellow banner when payment session is active
- Red banner for payment errors
- Clear action buttons for session management

## Usage

### Basic Integration

```typescript
import { usePaymentSession } from '@/hooks/usePaymentSession';

const PaymentComponent = () => {
  const { hasActiveSession, createSession, updateSessionStatus } = usePaymentSession();

  const handlePayment = async () => {
    if (hasActiveSession) {
      alert('Payment session already active');
      return;
    }

    try {
      createSession({
        sessionId: 'unique_session_id',
        userId: 'user_123',
        amount: 200000,
        currency: 'inr'
      });

      // Proceed with payment...
    } catch (error) {
      console.error('Payment session error:', error);
    }
  };

  return (
    <div>
      {hasActiveSession && (
        <div className="payment-warning">
          Payment session active in another tab
        </div>
      )}
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};
```

### Backend Integration

The backend payment routes now accept session metadata:

```typescript
// POST /payment/create-checkout-session
{
  userId: string,
  trainerId: string,
  planId: string
}
```

Success and cancel URLs are dynamically generated to return users to the correct page with payment status.


## Security Considerations

- Sessions are stored in localStorage (client-side only)
- Session IDs are unique and time-based
- Automatic expiration prevents indefinite sessions
- No sensitive payment data is stored in sessions

## Browser Compatibility

- Uses modern localStorage API
- Cross-tab communication via storage events
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## Future Enhancements

- Server-side session validation
- Integration with payment webhooks
- Session analytics and monitoring
- Enhanced error recovery mechanisms
