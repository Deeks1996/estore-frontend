import React from 'react';
import { CheckCircle, Hourglass, XCircle } from 'lucide-react';

const RecentOrders = ({ orders }) => {
  if (!orders) return <div>Loading...</div>;

  const statusIcon = {
    Delivered: <CheckCircle className="text-green-500" size={20} />,
    Ordered: <Hourglass className="text-yellow-500 animate-pulse" size={20} />,
    Cancelled: <XCircle className="text-red-500" size={20} />,
    Dispatched: <Hourglass className="text-blue-500 animate-pulse" size={20} />,
    'CancelRequested': <XCircle className="text-orange-500" size={20} />
  };

  return (
    <div className="bg-blue-900 shadow-xl p-8 rounded-xl">
      <h2 className="text-3xl font-semibold text-white mb-6">Recent Orders</h2>
      
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">Order #{order.id}</span>
              <span className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
              {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-blue-200 m-1 border border-black p-3 rounded-lg shadow-md flex flex-row md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name} × {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">Price: ₹{item.totalPrice}</p>
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
                        </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrders;
