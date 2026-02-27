'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/components/store/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useDebounce } from '@/components/hooks/useDebounce';
import { Restaurant, MenuItem, InstamartProduct } from '@/components/types';

type SearchResult = {
  type: 'restaurant' | 'dish' | 'product';
  id: string;
  name: string;
  image: string;
  subtitle: string;
  link: string;
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isQuickBite = pathname?.startsWith('/quickbite') || pathname?.startsWith('/restaurant');
  const isQuickMart = pathname?.startsWith('/quickmart');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSearchResults(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const fetchSearchResults = async (query: string) => {
    try {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];
      
      if (isQuickMart) {
        const productsRes = await fetch('/api/products');
        const products: InstamartProduct[] = await productsRes.json();
        
        products
          .filter(p => p.name.toLowerCase().includes(q))
          .slice(0, 5)
          .forEach(p => {
            results.push({
              type: 'product',
              id: p.id,
              name: p.name,
              image: p.image,
              subtitle: `₹${p.price}`,
              link: '/quickmart',
            });
          });
      } else {
        const [restaurantsRes, menuRes] = await Promise.all([
          fetch('/api/restaurants'),
          fetch('/api/menu'),
        ]);
        
        const restaurants: Restaurant[] = await restaurantsRes.json();
        const menuItems: MenuItem[] = await menuRes.json();
        
        restaurants
          .filter(r => r.name.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach(r => {
            results.push({
              type: 'restaurant',
              id: r.id,
              name: r.name,
              image: r.image,
              subtitle: r.cuisine.join(', '),
              link: `/restaurant/${r.id}`,
            });
          });
        
        menuItems
          .filter(m => m.name.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach(m => {
            results.push({
              type: 'dish',
              id: m.id,
              name: m.name,
              image: m.image,
              subtitle: `₹${m.price}`,
              link: `/restaurant/${m.restaurantId}`,
            });
          });
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(result.link);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const getServiceColor = () => {
    if (isQuickMart) return 'green';
    if (isQuickBite) return 'orange';
    return 'gray';
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                THE QUICK
              </span>
            </div>
            <div className="w-96 h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const serviceColor = getServiceColor();
  const gradientFrom = serviceColor === 'green' ? 'from-green-500' : serviceColor === 'orange' ? 'from-orange-500' : 'from-gray-500';
  const gradientTo = serviceColor === 'green' ? 'to-emerald-500' : serviceColor === 'orange' ? 'to-red-500' : 'to-gray-600';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              THE QUICK
            </span>
            {isQuickBite && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                QuickBite
              </span>
            )}
            {isQuickMart && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                QuickMart
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer">
            <svg className={`w-5 h-5 ${gradientFrom} bg-clip-text text-transparent`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Nashik</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder={isQuickMart ? "Search products..." : isQuickBite ? "Search dishes or restaurants..." : "Search for anything..."}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent focus:bg-white focus:border-orange-300 rounded-xl outline-none transition-all"
              />
            </div>
            
            {showSearchResults && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, idx) => (
                      <button
                        key={`${result.type}-${result.id}-${idx}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image 
                            src={result.image} 
                            alt={result.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {result.type === 'restaurant' ? 'Restaurant' : result.type === 'dish' ? 'Dish' : 'Product'}
                            </span>
                            <span className="font-medium text-gray-900 truncate">{result.name}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className={`relative p-2.5 rounded-xl transition-colors ${
                isQuickMart 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-orange-600 hover:bg-orange-50'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center text-white font-medium`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === 'quickbite_admin' ? '/admin/quickbite' : user.role === 'quickmart_admin' ? '/admin/quickmart' : user.role === 'rider' ? '/rider/dashboard' : '/'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {user.role === 'quickbite_admin' ? 'QuickBite Admin' : user.role === 'quickmart_admin' ? 'QuickMart Admin' : user.role === 'rider' ? 'Rider Dashboard' : 'My Orders'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-medium rounded-xl hover:opacity-90 transition-opacity`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
