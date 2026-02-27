'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
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

export default function RestaurantsPage() {
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

  const filteredRestaurants = selectedCuisine === 'All' ? restaurants : restaurants.filter((r: Restaurant) => 
        r.cuisine.some(c => c.toLowerCase().includes(selectedCuisine.toLowerCase()))
      );

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Restaurants in Nashik</h1>
          <p className="text-gray-500">{filteredRestaurants.length} restaurants</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Cuisine Filters */}
          <div className="flex flex-wrap gap-2">
            {cuisineFilters.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="rating">Sort by: Rating</option>
            <option value="deliveryTime">Sort by: Delivery Time</option>
            <option value="distance">Sort by: Distance</option>
          </select>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try a different cuisine or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant: Restaurant) => {
              const status = getRestaurantStatus(restaurant.openingTime, restaurant.closingTime);
              
              return (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.id}`}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                    !status.isOpen ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white ${
                      status.isOpen ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {status.label}
                    </div>
                    {/* Busy Badge */}
                    {restaurant.busyMode && status.isOpen && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                        Busy
                      </div>
                    )}
                    {/* Closed Overlay */}
                    {!status.isOpen && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <span className="text-white font-medium">Currently Closed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{restaurant.cuisine.join(', ')}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium ml-2">
                        <span>★</span>
                        {restaurant.rating}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {restaurant.deliveryTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {restaurant.distance} km
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
