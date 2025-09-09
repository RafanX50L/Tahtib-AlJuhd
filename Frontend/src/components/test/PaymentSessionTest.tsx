import React from 'react';
import { usePaymentSession } from '../hooks/usePaymentSession';

/**
 * Test component to demonstrate multi-tab payment prevention
 * This can be used for testing the functionality
 */
const PaymentSessionTest: React.FC = () => {
  const { 
    hasActiveSession, 
    currentSession, 
    createSession, 
    updateSessionStatus, 
    clearSession, 
    error 
  } = usePaymentSession();

  const handleCreateTestSession = () => {
    try {
      createSession({
        sessionId: `test_session_${Date.now()}`,
        userId: 'test_user_123',
        trainerId: 'test_trainer_456',
        planId: 'test_plan_789',
        amount: 200000,
        currency: 'inr'
      });
    } catch (err) {
      console.error('Failed to create test session:', err);
    }
  };

  const handleCompleteSession = () => {
    updateSessionStatus('completed');
  };

  const handleCancelSession = () => {
    updateSessionStatus('cancelled');
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h3 className="text-xl font-bold mb-4">Payment Session Test</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">Session Status:</h4>
          <p>Has Active Session: {hasActiveSession ? 'Yes' : 'No'}</p>
          {currentSession && (
            <div className="mt-2 text-sm">
              <p>Session ID: {currentSession.sessionId}</p>
              <p>Status: {currentSession.status}</p>
              <p>User ID: {currentSession.userId}</p>
              <p>Amount: ₹{currentSession.amount / 100}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900 border border-red-500 rounded">
            <h4 className="font-semibold text-red-200">Error:</h4>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleCreateTestSession}
            disabled={hasActiveSession}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Create Test Session
          </button>
          
          <button
            onClick={handleCompleteSession}
            disabled={!hasActiveSession}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Complete Session
          </button>
          
          <button
            onClick={handleCancelSession}
            disabled={!hasActiveSession}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Cancel Session
          </button>
          
          <button
            onClick={clearSession}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Session
          </button>
        </div>

        <div className="p-4 bg-blue-900 border border-blue-500 rounded">
          <h4 className="font-semibold text-blue-200">Instructions:</h4>
          <ul className="text-blue-300 text-sm mt-2 space-y-1">
            <li>1. Click "Create Test Session" to start a payment session</li>
            <li>2. Open this page in another tab</li>
            <li>3. Try to create another session in the new tab - it should be blocked</li>
            <li>4. Complete or cancel the session to allow new sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSessionTest;
