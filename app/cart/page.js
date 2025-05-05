"use client";

import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs';
import { toast, Toaster } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const { cartItems = [], updateItemQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    if (cartItems.length > 0) {
      setIsLoadingCart(false);
    }
  }, [cartItems]);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item?.price);
    const quantity = parseInt(item?.quantity);
    if (isNaN(price) || isNaN(quantity)) return sum;
    return sum + price * quantity;
  }, 0);

  const roundedTotalAmount = Math.round(totalAmount);
  const shippingCharge = roundedTotalAmount > 500 ? 0 : 40;
  const finalAmount = roundedTotalAmount + shippingCharge;
  const roundedFinalAmount = Math.round(finalAmount); 
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('You need to be logged in to proceed.');
      return;
    }
  
    setLoading(true);
  
    // Format and validate cart items
    const updatedCartItems = cartItems.map(item => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
  
      return {
        id: item.id,
        name: item.name,
        image: item.imageUrl,
        quantity,
        price: Math.round(price * 100), // Convert Rs to paisa
      };
    });
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedCartItems,
          totalAmount: roundedFinalAmount,
          userId: user.id,
          shippingCharge: shippingCharge * 100, // also in paisa
        }),
      });
  
      const data = await response.json();
  
      console.log('Checkout response:', data);
  
      if (data?.sessionId && data?.url) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast.error(`Checkout failed: ${data?.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-blue-200 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex bg-white rounded shadow-md p-4 gap-4 items-center">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Rs {item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="font-bold text-gray-600 hover:text-red-600">
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="mt-4 text-sm bg-red-600 text-white px-3 py-1 rounded-xl hover:bg-red-800 font-semibold"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-yellow-200 rounded shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <p className="text-gray-700 mb-2">Total Items: {totalItems}</p>
            <p className="text-lg font-bold">
              Total: Rs. {isNaN(roundedTotalAmount) ? '0.00' : roundedTotalAmount.toFixed(2)}
            </p>
            <p className="text-lg font-bold">
              Shipping Charge: Rs. {shippingCharge}
            </p>
            <p className="text-lg font-bold">
              Final Total: Rs. {roundedFinalAmount.toFixed(2)}
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`mt-6 w-full text-white py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </main>
  );
}
