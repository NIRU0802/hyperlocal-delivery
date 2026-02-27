'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '@/components/store/uiStore';
import { useDebounce } from '@/components/hooks/useDebounce';
import { Restaurant, MenuItem, InstamartProduct } from '@/components/types';

interface SearchResult {
  type: 'restaurant' | 'menu' | 'product';
  id: string;
  name: string;
  image: string;
  subtitle: string;
  link: string;
}

const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  const [restaurantsRes, menuRes, productsRes] = await Promise.all([
    fetch('/api/restaurants'),
    fetch('/api/menu'),
    fetch('/api/products'),
  ]);
  
  const restaurants: Restaurant[] = await restaurantsRes.json();
  const menuItems: MenuItem[] = await menuRes.json();
  const products: InstamartProduct[] = await productsRes.json();
  
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  
  restaurants
    .filter(r => r.name.toLowerCase().includes(q) || r.cuisine.some(c => c.toLowerCase().includes(q)))
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
    .filter(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(m => {
      results.push({
        type: 'menu',
        id: m.id,
        name: m.name,
        image: m.image,
        subtitle: `₹${m.price}`,
        link: `/restaurant/${m.restaurantId}`,
      });
    });
  
  products
    .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(p => {
      results.push({
        type: 'product',
        id: p.id,
        name: p.name,
        image: p.image,
        subtitle: `₹${p.price}`,
        link: '/instamart',
      });
    });
  
  return results;
};

export function SearchModal() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, searchResults, setSearchResults, isSearching, setIsSearching } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    const stored = localStorage.getItem('quickbite_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);
  
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      fetchSearchResults(debouncedQuery).then(results => {
        setSearchResults(results);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, setSearchResults, setIsSearching]);
  
  const handleResultClick = (result: SearchResult) => {
    const searches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    localStorage.setItem('quickbite_recent_searches', JSON.stringify(searches));
    setRecentSearches(searches);
    setSearchQuery('');
    setIsOpen(false);
    router.push(result.link);
  };
  
  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'menu': return '🍔';
      case 'product': return '🛒';
      default: return '🔍';
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full w-full max-w-md transition-colors"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-gray-500">Search restaurants, dishes...</span>
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants, dishes, products..."
                    className="flex-1 outline-none text-lg"
                    autoFocus
                  />
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh]">
                {isSearching && (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-500 mt-2">Searching...</p>
                  </div>
                )}
                
                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 mt-2">No results found for "{searchQuery}"</p>
                  </div>
                )}
                
                {!isSearching && searchResults.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-3 py-2">RESULTS</p>
                    {searchResults.map((result, idx) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={result.image} alt={result.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getTypeIcon(result.type)}</span>
                            <span className="font-medium truncate">{result.name}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {!isSearching && searchQuery.length < 2 && recentSearches.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-3 py-2">RECENT SEARCHES</p>
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentClick(term)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
