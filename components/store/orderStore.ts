import { create } from 'zustand';
import { Order, OrderStatus } from '@/components/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, message?: string) => void;
  setCurrentOrder: (order: Order | null) => void;
  simulateOrderProgress: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  currentOrder: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => {
    set({ orders: [...get().orders, order], currentOrder: order });
  },

  updateOrderStatus: (orderId, status, message) => {
    const orders = get().orders.map(o => {
      if (o.id === orderId) {
        const now = new Date().toISOString();
        const timeline = [...o.timeline, { status, timestamp: now, message: message || `Order ${status}` }];
        
        return {
          ...o,
          status,
          timeline,
          [`${status}At`]: now,
        };
      }
      return o;
    });

    const currentOrder = get().currentOrder?.id === orderId 
      ? orders.find(o => o.id === orderId) || null 
      : get().currentOrder;

    set({ orders, currentOrder });
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  simulateOrderProgress: (orderId) => {
    const statuses: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'picked', 'on_the_way', 'delivered'];
    const messages: Record<OrderStatus, string> = {
      placed: 'Order placed successfully',
      confirmed: 'Restaurant confirmed your order',
      preparing: 'Kitchen started preparing your food',
      ready: 'Food is ready for pickup',
      picked: 'Delivery partner picked up your order',
      on_the_way: 'Order is on the way',
      delivered: 'Order delivered successfully',
      cancelled: 'Order cancelled',
    };

    let currentIndex = 0;
    
    const interval = setInterval(() => {
      const currentOrder = get().currentOrder;
      if (!currentOrder || currentOrder.id !== orderId) {
        clearInterval(interval);
        return;
      }

      const currentStatus = currentOrder.status;
      const idx = statuses.indexOf(currentStatus);
      
      if (idx < statuses.length - 1) {
        const nextStatus = statuses[idx + 1];
        get().updateOrderStatus(orderId, nextStatus, messages[nextStatus]);
      } else {
        clearInterval(interval);
      }
    }, 10000);
  },
}));
