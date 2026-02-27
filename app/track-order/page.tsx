'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/components/store/orderStore';
import { formatCurrency } from '@/components/lib/utils';
import { OrderStatus } from '@/components/types';

const statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'placed', label: 'Order Placed', icon: '✓' },
  { status: 'confirmed', label: 'Confirmed', icon: '✓' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { status: 'ready', label: 'Ready', icon: '📦' },
  { status: 'picked', label: 'Picked Up', icon: '🚴' },
  { status: 'on_the_way', label: 'On The Way', icon: '🚚' },
  { status: 'delivered', label: 'Delivered', icon: '🎉' },
];

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const { currentOrder, orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const order = currentOrder || orders.find(o => o.id === orderId);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Order not found</p>
          <button onClick={() => router.push('/')} className="mt-4 text-primary-500 font-medium">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-xl font-semibold">Track Order</h1>
          <p className="text-primary-100">{order.orderNumber}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">{order.restaurantName}</h2>
              <p className="text-sm text-gray-500">{order.items.length} items • {formatCurrency(order.total)}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-500">
                {order.estimatedDeliveryTime} min
              </div>
              <div className="text-sm text-gray-500">ETA</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.status} className="relative flex items-center gap-4">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm z-10',
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    )}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className={cn(
                      'flex-1',
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    )}>
                      <div className={cn(
                        'font-medium',
                        isCurrent && 'text-primary-500'
                      )}>
                        {step.label}
                      </div>
                      {isCurrent && order.timeline[order.timeline.length - 1] && (
                        <div className="text-sm text-gray-500">
                          {order.timeline[order.timeline.length - 1].message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-primary-500 font-medium"
          >
            Order More
          </button>
        </div>
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
