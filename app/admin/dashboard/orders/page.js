"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusOptions = ["Ordered", "Dispatched", "Delivered", "Cancelled", "CancelRequested"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`);
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusChange = async (itemId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/item-status/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update item status");
      }

      fetchOrders();
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update item status.");
    }
  };

  const handleCancelOrder = async (itemId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/cancel/${itemId}`, {
        method: "PUT",
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message);
        // After cancellation, update the item status to 'Cancelled' in the state
        setOrders(prevOrders => 
          prevOrders.map(order => ({
            ...order,
            orderItems: order.orderItems.map(item => 
              item.id === itemId ? { ...item, status: "Cancelled" } : item
            )
          }))
        );
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order");
    }
  };
    
  const getStatusClass = (status) => {
    switch (status) {
      case "Ordered":
        return "bg-blue-500 text-white";
      case "Dispatched":
        return "bg-yellow-500 text-white";
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      case "CancelRequested":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-200 rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User Email</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Items</th>
              </tr>
            </thead>
            <tbody className="bg-gray-300">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.email}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-200 p-3 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name} × {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>

                            {item.status !== "Cancelled" && item.status !== "Delivered" && (
                              <button
                                onClick={() => handleCancelOrder(item.id)}
                                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 mt-2"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>

                          <div className="mt-2 md:mt-0 md:ml-4 flex items-center space-x-2">
                            <label className="text-sm">Status:</label>
                            <select
                              value={item.status}
                              onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
                              className={`border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300 ${getStatusClass(item.status)}`}
                            >
                              {statusOptions
                                .filter((status) => {
                                  if (status === "Cancelled") {
                                    return item.status === "Cancelled" || item.status === "CancelRequested";
                                  }
                                  return true; 
                                })
                                .map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdminOrdersPage;
