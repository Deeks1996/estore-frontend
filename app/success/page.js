'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useClerk } from '@clerk/clerk-react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Success() {
  const { clearCart, cartItems } = useCart();
  const { user } = useClerk();

  const hasSaved = useRef(false); 

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const urlParams = new URLSearchParams(window.location.search);

    const sessionId = urlParams.get('session_id');
    const totalAmount = urlParams.get('totalAmount');
    const userId = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress;

    if (userId && email) {
      const saveOrder = async () => {
        const orderPayload = {
          stripeSessionId: sessionId,
          email,
          totalAmount,
          status: 'Ordered',
          userId,
          items: cartItems,
        };


        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderPayload),
          });

          const data = await response.json();

          if (data.id) {
            console.log('Order saved successfully:', data);
            clearCart();
            window.history.replaceState({}, document.title, '/success');
          } else {
            console.error('Failed to save order:', data);
          }
        } catch (error) {
          console.error('Error saving order:', error);
        }
      };

      saveOrder();
    } else {
      console.error('Payment failed or invalid session data.');
    }
  }, [clearCart, cartItems, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <CheckCircle className="text-green-600 w-20 h-20 mb-6" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Your order has been confirmed. Thank you for shopping with us!
      </p>
      <Link href="/products">
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
