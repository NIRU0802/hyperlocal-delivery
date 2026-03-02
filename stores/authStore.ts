import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'user' | 'rider' | 'quickbite_admin' | 'quickmart_admin';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  addresses: Array<{
    id: string;
    label: string;
    fullAddress: string;
    coordinates: { lat: number; lng: number };
    isDefault: boolean;
  }>;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCookiesFromStore: () => Promise<void>;
  clearCookies: () => Promise<void>;
}

const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    email: 'user@quickbite.com',
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    role: 'user',
    addresses: [
      {
        id: 'addr_001',
        label: 'Home',
        fullAddress: 'Flat 201, Green Valley Apartments, Nashik',
        coordinates: { lat: 20.0100, lng: 73.7850 },
        isDefault: true,
      },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'rider_001',
    email: 'rider@quickbite.com',
    name: 'Vikram Jadhav',
    phone: '+91 9876543211',
    role: 'rider',
    addresses: [],
    createdAt: '2024-02-01',
  },
  {
    id: 'admin_qb_001',
    email: 'quickbite@admin.com',
    name: 'Sanjay Patil',
    phone: '+91 9876543212',
    role: 'quickbite_admin',
    addresses: [],
    createdAt: '2023-12-01',
  },
  {
    id: 'admin_qm_001',
    email: 'quickmart@admin.com',
    name: 'Priya Desai',
    phone: '+91 9876543213',
    role: 'quickmart_admin',
    addresses: [],
    createdAt: '2023-12-01',
  },
];

const setAuthCookies = async (role: UserRole) => {
  if (typeof document === 'undefined') return;
  document.cookie = `thequick-role=${role}; path=/; max-age=86400`;
  document.cookie = `thequick-auth=true; path=/; max-age=86400`;
};

const clearAuthCookies = async () => {
  if (typeof document === 'undefined') return;
  document.cookie = 'thequick-role=; path=/; max-age=0';
  document.cookie = 'thequick-auth=; path=/; max-age=0';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        if (password !== '123456') return false;

        const user = MOCK_USERS.find((u) => u.email === email);
        if (user) {
          set({
            user,
            role: user.role,
            isAuthenticated: true,
          });
          await setAuthCookies(user.role);
          return true;
        }
        return false;
      },
      logout: () => {
        clearAuthCookies();
        set({ user: null, role: null, isAuthenticated: false });
      },
      setCookiesFromStore: async () => {
        const state = useAuthStore.getState();
        if (state.isAuthenticated && state.role) {
          await setAuthCookies(state.role);
        }
      },
      clearCookies: async () => {
        await clearAuthCookies();
      },
    }),
    {
      name: 'thequick-auth',
      partialize: (state) => ({ user: state.user, role: state.role, isAuthenticated: state.isAuthenticated }),
    }
  )
);
