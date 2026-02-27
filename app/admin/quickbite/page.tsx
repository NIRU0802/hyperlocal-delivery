'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSystemStore } from '@/stores/systemStore';

type OrderStatus = 'NEW' | 'ACCEPTED' | 'COOKING' | 'READY' | 'PICKED';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  status: OrderStatus;
  total: number;
  restaurantName: string;
  placedAt: string;
  prepTime: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'QB-1001',
    customerName: 'Rahul Sharma',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 250 },
      { name: 'Tandoori Roti', quantity: 4, price: 40 },
    ],
    status: 'NEW',
    total: 580,
    restaurantName: 'Spice Garden',
    placedAt: new Date().toISOString(),
    prepTime: 25,
  },
  {
    id: '2',
    orderNumber: 'QB-1002',
    customerName: 'Priya Desai',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 350 },
      { name: 'Garlic Bread', quantity: 1, price: 120 },
    ],
    status: 'COOKING',
    total: 470,
    restaurantName: 'Pizza Palace',
    placedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    prepTime: 20,
  },
  {
    id: '3',
    orderNumber: 'QB-1003',
    customerName: 'Vikram Jadhav',
    items: [
      { name: 'Chicken Burger', quantity: 2, price: 199 },
      { name: 'French Fries', quantity: 1, price: 99 },
      { name: 'Cold Drink', quantity: 2, price: 60 },
    ],
    status: 'READY',
    total: 557,
    restaurantName: 'Burger Barn',
    placedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    prepTime: 15,
  },
  {
    id: '4',
    orderNumber: 'QB-1004',
    customerName: 'Sanjay Patil',
    items: [
      { name: 'Vegetable Fried Rice', quantity: 1, price: 180 },
      { name: 'Spring Roll', quantity: 2, price: 100 },
    ],
    status: 'PICKED',
    total: 280,
    restaurantName: 'China Town',
    placedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    prepTime: 18,
  },
];

const menuItems = [
  { id: '1', name: 'Chicken Biryani', price: 250, available: true, prepTime: 20 },
  { id: '2', name: 'Veg Biryani', price: 200, available: true, prepTime: 18 },
  { id: '3', name: 'Tandoori Roti', price: 40, available: true, prepTime: 5 },
  { id: '4', name: 'Butter Chicken', price: 320, available: false, prepTime: 25 },
  { id: '5', name: 'Palak Paneer', price: 280, available: true, prepTime: 20 },
];

export default function QuickBiteAdminPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { rainMode, demandLevel, setRainMode, setDemandLevel } = useSystemStore();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'timing'>('orders');
  const [kitchenLoad, setKitchenLoad] = useState(65);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setKitchenLoad(Math.floor(Math.random() * 40) + 40);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isRestaurantOpen = currentTime.getHours() >= 10 && currentTime.getHours() < 23;
  const menuAvailable = currentTime.getHours() >= 10 || (currentTime.getHours() === 9 && currentTime.getMinutes() >= 59);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'ACCEPTED': return 'bg-yellow-500';
      case 'COOKING': return 'bg-orange-500';
      case 'READY': return 'bg-green-500';
      case 'PICKED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    switch (status) {
      case 'NEW': return 'ACCEPTED';
      case 'ACCEPTED': return 'COOKING';
      case 'COOKING': return 'READY';
      case 'READY': return 'PICKED';
      default: return null;
    }
  };

  const updateOrderStatus = (orderId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const nextStatus = getNextStatus(order.status);
        return nextStatus ? { ...order, status: nextStatus } : order;
      }
      return order;
    }));
  };

  const getOrdersByStatus = (status: OrderStatus) => orders.filter(o => o.status === status);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">🍔</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">QuickBite Admin</h1>
              <p className="text-sm text-gray-400">Restaurant Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
              <span className={`w-2 h-2 rounded-full ${rainMode ? 'bg-blue-400' : 'bg-gray-400'}`} />
              <span className="text-sm">Rain Mode</span>
              <button
                onClick={() => setRainMode(!rainMode)}
                className={`w-10 h-5 rounded-full transition-colors ${rainMode ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${rainMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              {user?.name}
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Kitchen Load</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl font-bold">{kitchenLoad}%</div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${kitchenLoad}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Active Orders</h3>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold">{orders.length}</div>
            <div className="mt-2 text-sm text-gray-400">
              {getOrdersByStatus('NEW').length} new
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Status</h3>
              <span className="text-2xl">🕐</span>
            </div>
            <div className={`text-3xl font-bold ${isRestaurantOpen ? 'text-green-400' : 'text-red-400'}`}>
              {isRestaurantOpen ? 'OPEN' : 'CLOSED'}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {menuAvailable ? 'Menu enabled' : 'Menu disabled'}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Demand Level</h3>
              <span className="text-2xl">📈</span>
            </div>
            <select
              value={demandLevel}
              onChange={(e) => setDemandLevel(e.target.value as 'LOW' | 'NORMAL' | 'HIGH')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
            </select>
            {rainMode && (
              <div className="mt-2 text-sm text-blue-400">
                +20% delivery fee
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {(['orders', 'menu', 'timing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['NEW', 'ACCEPTED', 'COOKING', 'READY', 'PICKED'] as OrderStatus[]).map((status) => (
              <div key={status} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${getStatusColor(status)} px-3 py-1 rounded-full text-sm`}>
                    {status}
                  </h3>
                  <span className="text-gray-400 text-sm">{getOrdersByStatus(status).length}</span>
                </div>
                <div className="space-y-3">
                  {getOrdersByStatus(status).map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/50 rounded-xl p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{order.orderNumber}</span>
                        <span className="text-green-400 font-medium">₹{order.total}</span>
                      </div>
                      <p className="text-sm text-gray-400">{order.customerName}</p>
                      <p className="text-xs text-gray-500 mb-2">{order.restaurantName}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      {getNextStatus(order.status) && (
                        <button
                          onClick={() => updateOrderStatus(order.id)}
                          className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Move to {getNextStatus(order.status)}
                        </button>
                      )}
                    </motion.div>
                  ))}
                  {getOrdersByStatus(status).length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No orders</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Dish Name</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Prep Time</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">₹{item.price}</td>
                    <td className="px-6 py-4">{item.prepTime} min</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-orange-400 hover:text-orange-300 text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-6">Restaurant Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-5">
                <h4 className="font-medium mb-3">Opening Hours</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Opening Time</span>
                    <span className="font-semibold">10:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Closing Time</span>
                    <span className="font-semibold">11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Menu Enable Time</span>
                    <span className="font-semibold">10:01 AM</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-5">
                <h4 className="font-medium mb-3">Current Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Restaurant</span>
                    <span className={`font-semibold ${isRestaurantOpen ? 'text-green-400' : 'text-red-400'}`}>
                      {isRestaurantOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Menu Status</span>
                    <span className={`font-semibold ${menuAvailable ? 'text-green-400' : 'text-red-400'}`}>
                      {menuAvailable ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
