'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle, Hourglass, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

const statusIcon = {
  Delivered: <CheckCircle className="text-green-500" size={20} />,
  Ordered: <Hourglass className="text-yellow-500 animate-pulse" size={20} />,
  Cancelled: <XCircle className="text-red-500" size={20} />,
  Dispatched: <Hourglass className="text-blue-500 animate-pulse" size={20} />,
  'CancelRequested': <XCircle className="text-orange-500" size={20} />
};

const OrdersPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/signin');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${user.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoaded, isSignedIn, user]);

  const handleCancelRequest = async (itemId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/cancel-request/${itemId}`, {
        method: 'PUT'
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Cancellation requested!');
        setOrders((prev) =>
          prev.map((order) => ({
            ...order,
            orderItems: order.orderItems.map((item) =>
              item.id === itemId ? { ...item, status: 'CancelRequested' } : item
            )
          }))
        );
      } else {
        toast.error(data.error || 'Failed to request cancellation.');
      }
    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast.error('Error requesting cancellation');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-200">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Your Orders</h1>

      {loading && <p className="text-gray-500 text-center">Loading your orders...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}
      {!loading && orders.length === 0 && !error && (
        <p className="text-red-600 text-center">No orders found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-300 border border-gray-600 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">Order ID:</span> {order.id}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-2">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Items in this Order:</h3>
              <ul className="space-y-3">
                {order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <li
                      key={item.id}
                      className="bg-gray-100 rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                    >
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {item.name} ({item.quantity} × Rs. {item.price})
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          {statusIcon[item.status] || null}
                          <span
                            className={
                              item.status === 'Delivered'
                                ? 'text-green-600'
                                : item.status === 'Ordered'
                                ? 'text-yellow-600'
                                : item.status === 'Cancelled'
                                ? 'text-red-600'
                                : item.status === 'Dispatched'
                                ? 'text-blue-600'
                                : item.status === 'CancelRequested'
                                ? 'text-orange-600'
                                : 'text-gray-500'
                            }
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex gap-2">
                        {item.status === 'Ordered' && item.status !== 'CancelRequested' && (
                          <button
                            onClick={() => handleCancelRequest(item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No items in this order.</p>
                )}
              </ul>
            </div>

            <div className="mt-4 text-right">
              <p className="text-lg font-bold text-gray-900">Total: Rs. {order.totalAmount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
