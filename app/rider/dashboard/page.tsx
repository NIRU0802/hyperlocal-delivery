'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSystemStore } from '@/stores/systemStore';

type DeliveryType = 'quickbite' | 'quickmart';

interface NearbyOrder {
  id: string;
  orderNumber: string;
  type: DeliveryType;
  restaurantName: string;
  customerName: string;
  address: string;
  distance: number;
  earnings: number;
  rainBonus: boolean;
  items: string[];
}

interface ActiveDelivery {
  id: string;
  orderNumber: string;
  type: DeliveryType;
  from: string;
  to: string;
  status: 'picked' | 'delivering';
  earnings: number;
}

const RiderMap = dynamic(() => import('@/components/RiderMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

const mockNearbyOrders: NearbyOrder[] = [
  {
    id: '1',
    orderNumber: 'QB-1005',
    type: 'quickbite',
    restaurantName: 'Spice Garden',
    customerName: 'Rahul Sharma',
    address: 'Green Valley Apartments, Nashik',
    distance: 1.2,
    earnings: 45,
    rainBonus: false,
    items: ['Chicken Biryani x2', 'Roti x4'],
  },
  {
    id: '2',
    orderNumber: 'QM-2005',
    type: 'quickmart',
    restaurantName: 'QuickMart Warehouse',
    customerName: 'Priya Desai',
    address: 'Skyline Towers, Nashik',
    distance: 2.1,
    earnings: 55,
    rainBonus: true,
    items: ['Amul Milk x2', 'Bread x1', 'Thums Up x3'],
  },
  {
    id: '3',
    orderNumber: 'QB-1006',
    type: 'quickbite',
    restaurantName: 'Pizza Palace',
    customerName: 'Vikram Jadhav',
    address: 'Lake View Homes, Nashik',
    distance: 1.8,
    earnings: 40,
    rainBonus: false,
    items: ['Pizza Margherita x1', 'Garlic Bread x1'],
  },
];

export default function RiderDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { rainMode } = useSystemStore();
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('available');
  const [nearbyOrders, setNearbyOrders] = useState<NearbyOrder[]>(mockNearbyOrders);
  const [activeDelivery, setActiveDelivery] = useState<ActiveDelivery | null>(null);
  const [earnings, setEarnings] = useState({ today: 450, week: 3200, deliveries: 12 });
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const acceptOrder = (order: NearbyOrder) => {
    setActiveDelivery({
      id: order.id,
      orderNumber: order.orderNumber,
      type: order.type,
      from: order.restaurantName,
      to: order.address,
      status: 'picked',
      earnings: order.rainBonus ? Math.round(order.earnings * 1.2) : order.earnings,
    });
    setNearbyOrders(orders => orders.filter(o => o.id !== order.id));
  };

  const completeDelivery = () => {
    if (activeDelivery) {
      setEarnings(e => ({
        today: e.today + activeDelivery.earnings,
        week: e.week + activeDelivery.earnings,
        deliveries: e.deliveries + 1,
      }));
      setActiveDelivery(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">🛵</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Rider Panel</h1>
              <p className="text-sm text-gray-400">Deliveries in Nashik</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {rainMode && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <span className="text-blue-400 text-sm">🌧️ Rain Bonus Active</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Status:</span>
              <button
                onClick={() => setStatus(status === 'online' ? 'offline' : 'online')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  status === 'online' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {status === 'online' ? '🟢 Online' : '🔴 Offline'}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Today's Earnings</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-green-400">₹{earnings.today}</div>
            <div className="mt-2 text-sm text-gray-400">
              {earnings.deliveries} deliveries today
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Weekly Earnings</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold">₹{earnings.week}</div>
            <div className="mt-2 text-sm text-gray-400">
              ₹{Math.round(earnings.week / 7)}/day avg
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Rain Bonus</h3>
              <span className="text-2xl">🌧️</span>
            </div>
            <div className={`text-3xl font-bold ${rainMode ? 'text-blue-400' : 'text-gray-500'}`}>
              {rainMode ? '+20%' : 'Inactive'}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {rainMode ? 'Currently active on all orders' : 'Enable rain mode for bonus'}
            </div>
          </div>
        </div>

        {activeDelivery && (
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-80">Active Delivery</div>
                <div className="text-2xl font-bold">{activeDelivery.orderNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">Earnings</div>
                <div className="text-2xl font-bold">₹{activeDelivery.earnings}</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  {activeDelivery.type === 'quickbite' ? '🍔' : '🛒'}
                </div>
                <div>
                  <div className="text-sm opacity-80">Pickup</div>
                  <div className="font-semibold">{activeDelivery.from}</div>
                </div>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  🏠
                </div>
                <div>
                  <div className="text-sm opacity-80">Delivery</div>
                  <div className="font-semibold">{activeDelivery.to}</div>
                </div>
              </div>
            </div>

            <div className="h-48 mb-4 rounded-xl overflow-hidden">
              <RiderMap />
            </div>

            <button
              onClick={completeDelivery}
              className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {activeDelivery.status === 'picked' ? 'Mark as Picked Up' : 'Complete Delivery'}
            </button>
          </div>
        )}

        {!activeDelivery && (
          <>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === 'available'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Available Orders ({nearbyOrders.length})
              </button>
            </div>

            {activeTab === 'available' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl p-5 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{order.type === 'quickbite' ? '🍔' : '🛒'}</span>
                        <span className="font-semibold">{order.orderNumber}</span>
                      </div>
                      {order.rainBonus && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          🌧️ Bonus
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm">From:</span>
                        <span className="text-sm">{order.restaurantName}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm">To:</span>
                        <span className="text-sm">{order.customerName}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm">Address:</span>
                        <span className="text-sm">{order.address}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      {order.items.join(' • ')}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-400">₹{order.earnings}</span>
                        {order.rainBonus && (
                          <span className="text-sm text-blue-400 ml-2">(+₹{Math.round(order.earnings * 0.2)})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <span>📍</span>
                        {order.distance} km
                      </div>
                    </div>

                    <button
                      onClick={() => acceptOrder(order)}
                      disabled={status === 'offline'}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
                    >
                      Accept Order
                    </button>
                  </motion.div>
                ))}
                {nearbyOrders.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <span className="text-6xl mb-4 block">🚴</span>
                    <h3 className="text-xl font-semibold mb-2">No orders nearby</h3>
                    <p className="text-gray-400">Check back soon for new deliveries</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
