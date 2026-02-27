'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSystemStore, DemandLevel } from '@/stores/systemStore';

type PickingStatus = 'NEW' | 'PICKING' | 'PACKING' | 'READY';

interface PickingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; location: string }[];
  status: PickingStatus;
  pickedAt?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  popular: boolean;
}

const mockPickingOrders: PickingOrder[] = [
  {
    id: '1',
    orderNumber: 'QM-2001',
    customerName: 'Rahul Sharma',
    items: [
      { name: 'Amul Milk', quantity: 2, location: 'A1-12' },
      { name: 'Britannia Bread', quantity: 1, location: 'B2-05' },
      { name: 'Thums Up', quantity: 3, location: 'C3-18' },
    ],
    status: 'NEW',
  },
  {
    id: '2',
    orderNumber: 'QM-2002',
    customerName: 'Priya Desai',
    items: [
      { name: 'Paper Boat Aamras', quantity: 1, location: 'C1-02' },
      { name: 'Lay\'s Classic', quantity: 2, location: 'D4-11' },
    ],
    status: 'PICKING',
    pickedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '3',
    orderNumber: 'QM-2003',
    customerName: 'Vikram Jadhav',
    items: [
      { name: 'Amul Butter', quantity: 1, location: 'A2-08' },
      { name: 'Kurkure Masala', quantity: 3, location: 'D4-15' },
    ],
    status: 'PACKING',
    pickedAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Paper Boat Aamras Mango Juice', brand: 'Paper Boat', category: 'Cold Drinks', price: 45, stock: 50, popular: true },
  { id: '2', name: 'Thums Up Soft Drink', brand: 'Coca-Cola', category: 'Cold Drinks', price: 40, stock: 120, popular: true },
  { id: '3', name: 'Pepsi', brand: 'PepsiCo', category: 'Cold Drinks', price: 35, stock: 100, popular: false },
  { id: '4', name: 'Amul Milk', brand: 'Amul', category: 'Dairy & Bread', price: 28, stock: 80, popular: true },
  { id: '5', name: 'Britannia Bread', brand: 'Britannia', category: 'Dairy & Bread', price: 35, stock: 25, popular: true },
  { id: '6', name: 'Lay\'s Classic Salted', brand: 'Lay\'s', category: 'Snacks & Munchies', price: 20, stock: 60, popular: true },
  { id: '7', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'Snacks & Munchies', price: 20, stock: 45, popular: false },
  { id: '8', name: 'Amul Butter', brand: 'Amul', category: 'Dairy & Bread', price: 55, stock: 0, popular: true },
];

const categories = [
  { id: 'fruits', name: 'Fruits & Vegetables', order: 1 },
  { id: 'dairy', name: 'Dairy & Bread', order: 2 },
  { id: 'drinks', name: 'Cold Drinks', order: 3 },
  { id: 'snacks', name: 'Snacks & Munchies', order: 4 },
  { id: 'instant', name: 'Instant Food', order: 5 },
  { id: 'breakfast', name: 'Breakfast & Cereals', order: 6 },
  { id: 'icecream', name: 'Ice Creams', order: 7 },
  { id: 'personal', name: 'Personal Care', order: 8 },
  { id: 'cleaning', name: 'Cleaning Essentials', order: 9 },
];

export default function QuickMartAdminPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { rainMode, demandLevel, setRainMode, setDemandLevel } = useSystemStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'picking' | 'categories'>('inventory');
  const [pickingOrders, setPickingOrders] = useState<PickingOrder[]>(mockPickingOrders);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getStatusColor = (status: PickingStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'PICKING': return 'bg-yellow-500';
      case 'PACKING': return 'bg-orange-500';
      case 'READY': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextPickingStatus = (status: PickingStatus): PickingStatus | null => {
    switch (status) {
      case 'NEW': return 'PICKING';
      case 'PICKING': return 'PACKING';
      case 'PACKING': return 'READY';
      default: return null;
    }
  };

  const updatePickingStatus = (orderId: string) => {
    setPickingOrders(orders => orders.map(order => {
      if (order.id === orderId) {
        const nextStatus = getNextPickingStatus(order.status);
        return nextStatus ? { ...order, status: nextStatus, pickedAt: new Date().toISOString() } : order;
      }
      return order;
    }));
  };

  const getOrdersByStatus = (status: PickingStatus) => pickingOrders.filter(o => o.status === status);

  const updateStock = (productId: string, newStock: number) => {
    setProducts(products => products.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const togglePopular = (productId: string) => {
    setProducts(products => products.map(p => 
      p.id === productId ? { ...p, popular: !p.popular } : p
    ));
  };

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 30);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">🛒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">QuickMart Admin</h1>
              <p className="text-sm text-gray-400">Store Operations</p>
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
              <h3 className="text-gray-400 text-sm font-medium">Active Picks</h3>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold">{pickingOrders.length}</div>
            <div className="mt-2 text-sm text-gray-400">
              {getOrdersByStatus('NEW').length} new
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Low Stock</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{lowStockProducts.length}</div>
            <div className="mt-2 text-sm text-gray-400">
              Items below 30 units
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Out of Stock</h3>
              <span className="text-2xl">🚫</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{outOfStockProducts.length}</div>
            <div className="mt-2 text-sm text-gray-400">
              Need restock urgently
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">Demand Simulator</h3>
              <span className="text-2xl">📈</span>
            </div>
            <select
              value={demandLevel}
              onChange={(e) => setDemandLevel(e.target.value as DemandLevel)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
            </select>
            {demandLevel === 'HIGH' && (
              <div className="mt-2 text-sm text-orange-400">
                Popular items highlighted
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {(['inventory', 'picking', 'categories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'inventory' ? 'Inventory' : tab === 'picking' ? 'Picking Queue' : 'Categories'}
            </button>
          ))}
        </div>

        {activeTab === 'inventory' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Product</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Brand</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Stock</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Popular</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-700">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-400">{product.brand}</td>
                    <td className="px-6 py-4 text-gray-400">{product.category}</td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStock(product.id, Math.max(0, product.stock - 10))}
                          className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className={`w-12 text-center font-semibold ${
                          product.stock === 0 ? 'text-red-400' : product.stock <= 30 ? 'text-yellow-400' : ''
                        }`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => updateStock(product.id, product.stock + 10)}
                          className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePopular(product.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.popular 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {product.popular ? '★ Popular' : '☆ Normal'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-green-400 hover:text-green-300 text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'picking' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['NEW', 'PICKING', 'PACKING', 'READY'] as PickingStatus[]).map((status) => (
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
                      <div className="font-semibold mb-2">{order.orderNumber}</div>
                      <p className="text-sm text-gray-400">{order.customerName}</p>
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="text-gray-500">{item.location}</span>
                          </div>
                        ))}
                      </div>
                      {getNextPickingStatus(order.status) && (
                        <button
                          onClick={() => updatePickingStatus(order.id)}
                          className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Move to {getNextPickingStatus(order.status)}
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

        {activeTab === 'categories' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-6">Category Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-400">Order: {category.order}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                      <span className="text-gray-400">↑</span>
                    </button>
                    <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                      <span className="text-gray-400">↓</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
