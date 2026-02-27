'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Restaurant } from '@/components/types';
import { formatCurrency } from '@/components/lib/utils';

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const res = await fetch('/api/restaurants?sort=rating');
  return res.json();
};

const cuisineFilters = [
  'All',
  'Pizza',
  'Burgers',
  'Biryani',
  'Chicken',
  'South Indian',
  'Mughlai',
  'Italian',
];

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getRestaurantStatus = (openingTime: string, closingTime: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;
    
    const [openH, openM] = openingTime.split(':').map(Number);
    const [closeH, closeM] = closingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    
    if (currentTime < openMinutes || currentTime >= closeMinutes) {
      return { isOpen: false, label: 'Closed' };
    }
    return { isOpen: true, label: 'Open' };
  };

  const status = getRestaurantStatus(restaurant.openingTime, restaurant.closingTime);
  const isClosed = !status.isOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/restaurant/${restaurant.id}`}
        className={`block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${isClosed ? 'opacity-75' : ''}`}
      >
        <div className="relative h-48">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
            status.isOpen ? 'bg-green-500/90' : 'bg-gray-500/90'
          }`}>
            {status.label}
          </div>
          
          {restaurant.busyMode && status.isOpen && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90 text-white backdrop-blur-sm">
              Busy
            </div>
          )}
          
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1 text-white/90 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-white/70">({restaurant.reviewCount})</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">{restaurant.name}</h3>
              <p className="text-sm text-gray-500 truncate">{restaurant.cuisine.join(' • ')}</p>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {restaurant.deliveryTime} min
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {restaurant.distance} km
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <span>{restaurant.deliveryFee === 0 ? 'FREE' : formatCurrency(restaurant.deliveryFee)}</span>
            </div>
          </div>
          
          {restaurant.minOrder > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
              Min. order: {formatCurrency(restaurant.minOrder)}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function QuickBitePage() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [mounted, setMounted] = useState(false);

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants', sortBy],
    queryFn: () => fetch(`/api/restaurants?sort=${sortBy}`).then(r => r.json()),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRestaurants = selectedCuisine === 'All' 
    ? restaurants 
    : restaurants.filter((r: Restaurant) => 
        r.cuisine.some(c => c.toLowerCase().includes(selectedCuisine.toLowerCase()))
      );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 pb-8 pt-4">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🍔</span>
              <h1 className="text-3xl font-bold">QuickBite</h1>
            </div>
            <p className="text-white/80">Hot meals from nearby restaurants</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Popular Near You</h2>
          <p className="text-gray-500">{filteredRestaurants.length} restaurants</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {cuisineFilters.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="rating">Sort by: Rating</option>
            <option value="deliveryTime">Sort by: Delivery Time</option>
            <option value="distance">Sort by: Distance</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try a different cuisine or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant: Restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
