'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/components/store/cartStore';
import { useOrderStore } from '@/components/store/orderStore';
import { formatCurrency, cn } from '@/components/lib/utils';
import { Address } from '@/components/types';

const mockAddresses: Address[] = [
  { id: 'addr_001', label: 'Home', fullAddress: 'Flat 201, Green Valley Apartments, Nashik', coordinates: { lat: 20.0100, lng: 73.7850 }, isDefault: true },
  { id: 'addr_002', label: 'Office', fullAddress: 'Tech Park, IT Park Road, Nashik', coordinates: { lat: 20.0180, lng: 73.7750 }, isDefault: false },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, restaurantName, subtotal, deliveryFee, platformFee, total, serviceType, clearCart } = useCartStore();
  const { addOrder, simulateOrderProgress } = useOrderStore();
  
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(mockAddresses[0]);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button 
            onClick={() => router.push(serviceType === 'product' ? '/quickmart' : '/quickbite')} 
            className="text-orange-500 font-medium hover:underline"
          >
            Browse {serviceType === 'product' ? 'QuickMart' : 'Restaurants'}
          </button>
        </motion.div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = {
      id: `order_${Date.now()}`,
      orderNumber: `QB-${1000 + Math.floor(Math.random() * 1000)}`,
      userId: 'user_001',
      restaurantId: items[0]?.restaurantId || 'rest_001',
      restaurantName: restaurantName || (serviceType === 'product' ? 'QuickMart' : 'Restaurant'),
      items: orderItems,
      status: 'placed' as const,
      subtotal,
      deliveryFee,
      platformFee,
      discount: 0,
      total,
      deliveryAddress: selectedAddress!,
      paymentMethod: paymentMethod as 'cash' | 'card' | 'upi' | 'wallet',
      paymentStatus: 'paid' as const,
      placedAt: new Date().toISOString(),
      estimatedDeliveryTime: serviceType === 'product' ? 15 : 35,
      timeline: [
        { status: 'placed' as const, timestamp: new Date().toISOString(), message: 'Order placed successfully' }
      ],
    };

    addOrder(order);
    simulateOrderProgress(order.id);
    clearCart();
    
    setTimeout(() => {
      router.push(`/track-order?id=${order.id}`);
    }, 1000);
  };

  const steps = [
    { number: 1, label: 'Address' },
    { number: 2, label: 'Delivery' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Summary' },
  ];

  const gradientFrom = serviceType === 'product' ? 'from-green-500' : 'from-orange-500';
  const gradientTo = serviceType === 'product' ? 'to-emerald-500' : 'to-red-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2">
              {steps.map(s => (
                <div key={s.number} className="flex items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                    step >= s.number 
                      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white` 
                      : 'bg-gray-200 text-gray-500'
                  )}>
                    {s.number}
                  </div>
                  {s.number < 4 && <div className="w-8 h-0.5 bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Select Delivery Address</h2>
            {mockAddresses.map(addr => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedAddress(addr)}
                className={cn(
                  'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                  selectedAddress?.id === addr.id 
                    ? `border-${serviceType === 'product' ? 'green' : 'orange'}-500 shadow-md` 
                    : 'border-transparent hover:border-gray-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{addr.label}</span>
                  {addr.isDefault && (
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${serviceType === 'product' ? 'green' : 'orange'}-100 text-${serviceType === 'product' ? 'green' : 'orange'}-600`}>
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{addr.fullAddress}</p>
              </motion.div>
            ))}
            <button
              onClick={() => setStep(2)}
              className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white py-3 rounded-xl font-semibold mt-4 hover:opacity-90 transition-opacity`}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Delivery Option</h2>
            <div className="space-y-3">
              {[
                { id: 'standard', label: 'Standard Delivery', time: serviceType === 'product' ? '15-20 min' : '35-40 min', price: serviceType === 'product' ? 29 : 35 },
                { id: 'express', label: 'Express Delivery', time: serviceType === 'product' ? '10-15 min' : '20-25 min', price: serviceType === 'product' ? 49 : 60 },
              ].map(opt => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setDeliveryOption(opt.id)}
                  className={cn(
                    'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                    deliveryOption === opt.id 
                      ? `border-${serviceType === 'product' ? 'green' : 'orange'}-500 shadow-md` 
                      : 'border-transparent hover:border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-sm text-gray-500">{opt.time}</div>
                    </div>
                    <div className="font-semibold">{formatCurrency(opt.price)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                className={`flex-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 'upi', label: 'UPI', icon: '📱' },
                { id: 'card', label: 'Card', icon: '💳' },
                { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
                { id: 'wallet', label: 'Wallet', icon: '👛' },
              ].map(pm => (
                <motion.div
                  key={pm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={cn(
                    'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                    paymentMethod === pm.id 
                      ? `border-${serviceType === 'product' ? 'green' : 'orange'}-500 shadow-md` 
                      : 'border-transparent hover:border-gray-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-semibold">{pm.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setStep(2)} 
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(4)} 
                className={`flex-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-2">
                {restaurantName || (serviceType === 'product' ? 'QuickMart' : 'Restaurant')}
              </h3>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {platformFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-gray-600 text-sm">{selectedAddress?.fullAddress}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-gray-600 text-sm capitalize">{paymentMethod}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setStep(3)} 
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={placing}
                className={`flex-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                {placing ? 'Placing Order...' : `Pay ${formatCurrency(total)}`}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
