'use client';

import { useEffect, useState } from 'react';
import StatsCards from '../../../components/StatsCards';
import RecentOrders from '../../../components/RecentOrders.js';

export default function AdminDashboardPage() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {

      const fetchPerformanceData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/performance`);
          const data = await response.json();
          console.log("Fetched stats data:", data);
          setStats(data); 
        } catch (error) {
          console.error('Error fetching performance data:', error);
        }
      };
      fetchPerformanceData();

    // Fetch recent orders
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`)  
      .then((response) => response.json())
      .then((data) => setRecentOrders(data))
      .catch((error) => {
        console.error('Error fetching recent orders:', error);
      });
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-300 rounded-2xl">
      
      <StatsCards stats={stats} />

      <RecentOrders orders={recentOrders} />
    </div>
  );
}
