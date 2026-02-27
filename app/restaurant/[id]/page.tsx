'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/components/store/cartStore';
import { formatCurrency, cn } from '@/components/lib/utils';
import { Restaurant, MenuItem } from '@/components/types';
import { isRestaurantOpen, formatTime12Hour } from '@/lib/timeUtils';

const fetchRestaurant = async (id: string): Promise<Restaurant> => {
  const res = await fetch('/api/restaurants');
  const restaurants = await res.json();
  return restaurants.find((r: Restaurant) => r.id === id);
};

const fetchMenu = async (id: string): Promise<MenuItem[]> => {
  const res = await fetch(`/api/menu?restaurantId=${id}`);
  return res.json();
};

function MenuItemCard({ 
  item, 
  restaurantId, 
  restaurantName,
  isOpen 
}: { 
  item: MenuItem; 
  restaurantId: string;
  restaurantName: string;
  isOpen: boolean;
}) {
  const { addItem, items, updateQuantity } = useCartStore();
  
  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find(i => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  const quantity = getItemQuantity(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white rounded-2xl p-4 flex gap-4 transition-all',
        !item.available && 'opacity-50'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('w-4 h-4 rounded-full border-2 flex-shrink-0', item.veg ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100')} />
          {item.popular && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Popular</span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{formatCurrency(item.price)}</span>
            {item.calories && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.calories} cal</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
        />
        <div className="absolute bottom-0 right-0 p-1">
          {item.available && isOpen ? (
            quantity === 0 ? (
              <button
                onClick={() => addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  type: 'restaurant',
                  restaurantId,
                  restaurantName,
                })}
                className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                ADD
              </button>
            ) : (
              <motion.div 
                className="flex items-center gap-0.5 bg-orange-500 rounded-lg shadow-lg overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-white font-bold hover:bg-orange-600 rounded-l-lg transition-colors"
                >
                  −
                </button>
                <span className="text-white font-semibold min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    type: 'restaurant',
                    restaurantId,
                    restaurantName,
                  })}
                  className="w-8 h-8 flex items-center justify-center text-white font-bold hover:bg-orange-600 rounded-r-lg transition-colors"
                >
                  +
                </button>
              </motion.div>
            )
          ) : (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
      <div className="w-28 h-28 bg-gray-200 rounded-xl" />
    </div>
  );
}

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => fetchRestaurant(restaurantId),
  });

  const { data: menuItems = [], isLoading: loadingMenu } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => fetchMenu(restaurantId),
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loadingRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200" />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) return <div>Restaurant not found</div>;

  const status = isRestaurantOpen(restaurant.openingTime, restaurant.closingTime);
  const isMenuAvailable = status.isOpen;
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative h-64">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold',
              status.isOpen 
                ? 'bg-green-500/90 backdrop-blur-sm' 
                : 'bg-gray-500/90 backdrop-blur-sm'
            )}>
              {status.label}
            </span>
            {restaurant.busyMode && status.isOpen && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90 backdrop-blur-sm">
                Busy
              </span>
            )}
            {!status.isOpen && status.reason && (
              <span className="text-sm text-white/70">{status.reason}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-white/80">{restaurant.cuisine.join(' • ')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-green-500 font-bold">★ {restaurant.rating}</span>
            <span className="text-gray-500">({restaurant.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {restaurant.deliveryTime} min
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {restaurant.distance} km
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {restaurant.deliveryFee === 0 ? 'FREE Delivery' : formatCurrency(restaurant.deliveryFee)}
          </div>
          {restaurant.minOrder > 0 && (
            <div className="text-gray-500">
              Min. order: {formatCurrency(restaurant.minOrder)}
            </div>
          )}
        </div>

        {!isMenuAvailable && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">🕐</div>
            <p className="text-amber-800 font-semibold">Menu not available yet</p>
            <p className="text-amber-600 text-sm mt-1">
              The restaurant opens at {formatTime12Hour(restaurant.openingTime)} and menu will be available from {formatTime12Hour(restaurant.menuAvailableTime)}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {loadingMenu ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            categories.map(category => (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name}
                        isOpen={isMenuAvailable}
                      />
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
