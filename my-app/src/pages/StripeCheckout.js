import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

// 1. Put your Stripe Publishable Key here (starts with pk_test_)
const stripePromise = loadStripe(
  'pk_test_51SYBX1FZuc8ZSFzfzoFanZC15h5SZUhVM0wOcrooBSOwZnKJSfuvvTo19u6MmuljKHuld6PuAsrPFJpFlcMbNNCx00Id5xr9tD',
);

function CheckoutForm({ totalAmount, handleOrderSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Check URL parameters for payment status (if Stripe redirected back here)
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Confirm Payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // This URL is used only if Stripe forces a redirect (like for 3D Secure bank checks)
        return_url: `${window.location.origin}/order-success`,
      },
      // IMPORTANT: 'if_required' prevents redirect for standard cards,
      // allowing us to run handleOrderSuccess() immediately below.
      redirect: 'if_required',
    });

    if (error) {
      // Show error to your customer (e.g., insufficient funds)
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment Success! Now create the order in the database.
      handleOrderSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
      >
        <span id="button-text">
          {isLoading ? 'Processing...' : `Pay $${totalAmount}`}
        </span>
      </button>

      {/* Show any error messages */}
      {message && (
        <div
          id="payment-message"
          className="text-red-500 mt-4 text-center text-sm"
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default function StripeCheckout({ totalAmount, handleOrderSuccess }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Only fetch if totalAmount is valid to avoid backend errors
    if (totalAmount > 0) {
      fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalAmount: totalAmount }),
        },
      )
        .then((res) => {
          if (!res.ok) {
            // This catches 404 or 500 errors from your server
            return res.json().then((err) => {
              throw new Error(err.error || 'Server Error');
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => {
          console.error('Error connecting to backend:', error.message);
        });
    }
  }, [totalAmount]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="Stripe">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            totalAmount={totalAmount}
            handleOrderSuccess={handleOrderSuccess}
          />
        </Elements>
      ) : (
        <div className="flex flex-col justify-center items-center h-40">
          <div className="text-gray-500">Loading Payment Gateway...</div>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Check browser console if stuck
          </p>
        </div>
      )}
    </div>
  );
}
