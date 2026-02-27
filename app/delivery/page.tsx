'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/components/store/authStore';
import { useOrderStore } from '@/components/store/orderStore';
import { formatCurrency } from '@/components/lib/utils';

const mockAvailableOrders = [
  {
    id: 'order_101',
    orderNumber: 'QB-2001',
    restaurantName: 'Domino\'s Pizza',
    items: 3,
    total: 450,
    distance: 1.2,
    earnings: 45,
  },
  {
    id: 'order_102',
    orderNumber: 'QB-2002',
    restaurantName: 'KFC',
    items: 2,
    total: 380,
    distance: 2.5,
    earnings: 55,
  },
  {
    id: 'order_103',
    orderNumber: 'QB-2003',
    restaurantName: 'Biryani House',
    items: 4,
    total: 720,
    distance: 1.8,
    earnings: 65,
  },
];

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { orders, currentOrder, updateOrderStatus } = useOrderStore();
  const [activeTab, setActiveTab] = useState('available');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user || user.role !== 'delivery') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Please login as delivery partner</p>
          <button onClick={() => router.push('/login')} className="mt-4 text-primary-500">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const myEarnings = 12500;
  const todayDeliveries = 12;
  const rating = 4.8;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">QuickBite Delivery</h1>
            <p className="text-sm text-gray-400">{user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Rating</div>
              <div className="font-bold text-yellow-400">★ {rating}</div>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{formatCurrency(myEarnings)}</div>
          <div className="text-sm text-gray-400">Total Earnings</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{todayDeliveries}</div>
          <div className="text-sm text-gray-400">Today</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{rating}</div>
          <div className="text-sm text-gray-400">Rating</div>
        </div>
      </div>

      <div className="flex gap-2 px-4">
        {['available', 'active', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-lg font-medium capitalize ${
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="p-4 space-y-4">
        {activeTab === 'available' && (
          <>
            <h2 className="text-lg font-semibold">Available Orders</h2>
            {mockAvailableOrders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">{order.restaurantName}</div>
                    <div className="text-sm text-gray-400">{order.orderNumber} • {order.items} items</div>
                  </div>
                  <div className="text-green-400 font-medium">+{formatCurrency(order.earnings)}</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>{formatCurrency(order.total)}</span>
                  <span>{order.distance} km away</span>
                </div>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600">
                  Accept Order
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'active' && (
          <>
            <h2 className="text-lg font-semibold">Active Order</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No active delivery</div>
                <p className="text-sm text-gray-500">Accept an order to start delivering</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <h2 className="text-lg font-semibold">Delivery History</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="space-y-3">
                {[
                  { order: 'QB-1001', amount: 45, date: 'Today' },
                  { order: 'QB-998', amount: 55, date: 'Today' },
                  { order: 'QB-985', amount: 40, date: 'Yesterday' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                    <div>
                      <div className="font-medium">{item.order}</div>
                      <div className="text-xs text-gray-400">{item.date}</div>
                    </div>
                    <div className="text-green-400">+{formatCurrency(item.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
