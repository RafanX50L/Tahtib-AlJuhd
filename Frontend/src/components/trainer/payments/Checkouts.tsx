import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import axios from 'axios';

interface CheckoutProps {
  planId: string;
  userId: string;
  amount: number; // Amount in cents
  currency: string;
}

const Checkout: React.FC<CheckoutProps> = ({ planId, userId, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create payment intent
      const { data } = await axios.post<{ clientSecret: string}>('http://localhost:3000/api/payment/create-payment-intent', {
        amount,
        currency,
        planId,
        userId,
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm payment
      const cardElement = elements.getElement(CardElement) as StripeCardElement;
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Step 3: Notify backend to update user
        await axios.post('http://localhost:3000/api/payment/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          userId,
          planId,
        });
        alert('Payment successful! Plan activated.');
      }
    } catch (err: unknown) {
      setError((err as { message: string }).message || 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }}
      />
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || processing} style={{ marginTop: '20px', padding: '10px 20px' }}>
        {processing ? 'Processing...' : `Pay $${amount / 100}`}
      </button>
    </form>
  );
};

export default Checkout;