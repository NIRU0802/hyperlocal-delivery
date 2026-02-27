import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '@/components/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (email: string, password: string) => {
        if (password !== '123456') return false;
        
        const users = [
          { id: 'user_001', email: 'user@quickbite.com', name: 'Rahul Sharma', phone: '+91 9876543210', role: 'customer' as const, addresses: [{ id: 'addr_001', label: 'Home', fullAddress: 'Flat 201, Green Valley Apartments, Nashik', coordinates: { lat: 20.0100, lng: 73.7850 }, isDefault: true }], createdAt: '2024-01-15' },
          { id: 'user_002', email: 'rider@quickbite.com', name: 'Vikram Jadhav', phone: '+91 9876543211', role: 'delivery' as const, addresses: [], createdAt: '2024-02-01' },
          { id: 'user_003', email: 'admin@quickbite.com', name: 'Sanjay Patil', phone: '+91 9876543212', role: 'admin' as const, addresses: [], createdAt: '2023-12-01' },
        ];
        
        const user = users.find(u => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true, token: `mock_token_${Date.now()}` });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'quickbite-auth',
    }
  )
);
