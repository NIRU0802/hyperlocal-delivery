'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/components/store/cartStore';
import { formatCurrency } from '@/components/lib/utils';
import { InstamartProduct } from '@/components/types';

const fetchProducts = async (): Promise<InstamartProduct[]> => {
  const res = await fetch('/api/products');
  return res.json();
};

const categories = [
  { id: 'all', label: 'All', icon: '🛒' },
  { id: 'grocery', label: 'Grocery', icon: '🥫' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'snacks', label: 'Snacks', icon: '🍿' },
  { id: 'drinks', label: 'Drinks', icon: '🥤' },
  { id: 'instant food', label: 'Instant Food', icon: '🍜' },
  { id: 'household', label: 'Household', icon: '🧹' },
];

export default function InstamartPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['instamart-products'],
    queryFn: fetchProducts,
  });

  const { addItem, items, updateQuantity } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find(i => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 pb-4 pt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-green-600'
                    : 'bg-green-600/30 text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              {filteredProducts.length} items available
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const quantity = getItemQuantity(product.id);
                
                return (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-32">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.originalPrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold">{formatCurrency(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {quantity === 0 ? (
                          <button
                            onClick={() => addItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              type: 'product',
                            })}
                            disabled={!product.inStock}
                            className="w-full bg-green-500 text-white py-1.5 rounded text-sm font-medium disabled:bg-gray-300"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 bg-green-500 rounded">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white font-bold"
                            >
                              −
                            </button>
                            <span className="text-white font-medium">{quantity}</span>
                            <button
                              onClick={() => addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                type: 'product',
                              })}
                              className="w-8 h-8 flex items-center justify-center text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
