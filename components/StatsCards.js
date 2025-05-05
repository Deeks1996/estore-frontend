import React from 'react';

const StatsCards = ({ stats }) => {
  if (!stats) return <div>Loading...</div>; // Handle loading state

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
      {/* Total Orders Card */}
      <div className="p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2">Total Orders</h2>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>

      {/* Total Users Card */}
      <div className="p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </div>

      {/* Cancellations Card */}
      <div className="p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2">Cancellations</h2>
        <p className="text-3xl font-bold">{stats.totalCancellations}</p>
      </div>

      {/* Total Sales Card */}
      <div className="p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2">Total Sales</h2>
        <p className="text-3xl font-bold">Rs. {stats.totalSales}</p>
      </div>
    </div>
  );
};

export default StatsCards;
