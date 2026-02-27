import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (isSearching) => set({ isSearching }),
}));
