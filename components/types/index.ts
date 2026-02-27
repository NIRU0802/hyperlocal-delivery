export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  image: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingTime: string;
  menuAvailableTime: string;
  closingTime: string;
  busyMode: boolean;
  isOpen: boolean;
  distance: number;
  tags: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
  available: boolean;
  popular: boolean;
  calories?: number;
}

export interface InstamartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'delivery' | 'admin';
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicle: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  earnings: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed';
  placedAt: string;
  confirmedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
  estimatedDeliveryTime: number;
  deliveryPartner?: DeliveryPartner;
  timeline: TimelineEvent[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface TimelineEvent {
  status: OrderStatus;
  timestamp: string;
  message: string;
}
