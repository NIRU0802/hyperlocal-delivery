import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ItemType = 'restaurant' | 'product';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: ItemType;
  restaurantId?: string;
  restaurantName?: string;
}

interface CartState {
  items: CartItem[];
  serviceType: ItemType | null;
  restaurantId: string | null;
  restaurantName: string | null;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setServiceType: (type: ItemType | null) => void;
  calculateTotals: () => void;
}

const DELIVERY_FEE_THRESHOLD = 300;
const FREE_DELIVERY_THRESHOLD = 500;
const PLATFORM_FEE = 15;
const QUICKMART_DELIVERY = 29;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      serviceType: null,
      restaurantId: null,
      restaurantName: null,
      subtotal: 0,
      deliveryFee: 0,
      platformFee: PLATFORM_FEE,
      discount: 0,
      total: 0,

      setServiceType: (type) => {
        const { items, serviceType } = get();
        
        if (items.length > 0 && serviceType && serviceType !== type) {
          return;
        }
        
        set({ serviceType: type });
      },

      addItem: (item) => {
        const { items, serviceType, restaurantId, restaurantName } = get();
        
        const existingIndex = items.findIndex(i => i.id === item.id);
        
        let newItems: CartItem[];
        
        if (existingIndex >= 0) {
          newItems = items.map((i, idx) => 
            idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...items, { ...item, quantity: 1 }];
        }
        
        const newServiceType = item.type;
        const newRestaurantId = item.restaurantId || restaurantId;
        const newRestaurantName = item.restaurantName || restaurantName;

        set({ 
          items: newItems, 
          serviceType: newServiceType,
          restaurantId: newRestaurantId, 
          restaurantName: newRestaurantName 
        });
        get().calculateTotals();
      },

      removeItem: (itemId) => {
        const items = get().items.filter(i => i.id !== itemId);
        set({ items });
        
        if (items.length === 0) {
          set({
            serviceType: null,
            restaurantId: null,
            restaurantName: null,
          });
        }
        
        get().calculateTotals();
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        const items = get().items.map(i => 
          i.id === itemId ? { ...i, quantity } : i
        );
        set({ items });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          serviceType: null,
          restaurantId: null,
          restaurantName: null,
          subtotal: 0,
          deliveryFee: 0,
          platformFee: PLATFORM_FEE,
          discount: 0,
          total: 0,
        });
      },

      calculateTotals: () => {
        const { items, serviceType } = get();
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let deliveryFee = 0;
        
        if (serviceType === 'product') {
          deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : QUICKMART_DELIVERY;
        } else if (serviceType === 'restaurant') {
          deliveryFee = subtotal >= DELIVERY_FEE_THRESHOLD ? 0 : 35;
        }
        
        const platformFee = serviceType === 'product' ? 0 : PLATFORM_FEE;
        const total = subtotal + deliveryFee + platformFee - get().discount;
        
        set({ subtotal, deliveryFee, platformFee, total });
      },
    }),
    {
      name: 'thequick-cart',
    }
  )
);
