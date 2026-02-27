'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/components/store/cartStore';
import { useSystemStore } from '@/stores/systemStore';
import { formatCurrency } from '@/components/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  quantity: number;
}

const CATEGORIES = [
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables', icon: '🥬', color: 'from-green-500 to-emerald-500' },
  { id: 'dairy-bread', name: 'Dairy & Bread', icon: '🥛', color: 'from-blue-500 to-cyan-500' },
  { id: 'cold-drinks', name: 'Cold Drinks', icon: '🥤', color: 'from-purple-500 to-pink-500' },
  { id: 'snacks-munchies', name: 'Snacks & Munchies', icon: '🍿', color: 'from-yellow-500 to-orange-500' },
  { id: 'instant-food', name: 'Instant Food', icon: '🍜', color: 'from-red-500 to-rose-500' },
  { id: 'breakfast-cereals', name: 'Breakfast & Cereals', icon: '🥣', color: 'from-amber-500 to-yellow-500' },
  { id: 'ice-creams', name: 'Ice Creams', icon: '🍦', color: 'from-pink-500 to-rose-500' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', color: 'from-violet-500 to-purple-500' },
  { id: 'cleaning-essentials', name: 'Cleaning Essentials', icon: '🧹', color: 'from-teal-500 to-cyan-500' },
];

const ALL_PRODUCTS: Product[] = [
  { id: '1', name: 'Paper Boat Aamras Mango Juice', description: 'Rich & delicious mango pulp', price: 45, image: '/products/cold-drinks/paper-boat.webp', brand: 'Paper Boat', category: 'cold-drinks', inStock: true, quantity: 50 },
  { id: '2', name: 'Thums Up Soft Drink', description: 'Refreshing aerated drink', price: 40, image: '/products/cold-drinks/thums-up.webp', brand: 'Coca-Cola', category: 'cold-drinks', inStock: true, quantity: 100 },
  { id: '3', name: 'Pepsi', description: 'Bold cola flavor', price: 35, image: '/products/cold-drinks/pepsi.webp', brand: 'PepsiCo', category: 'cold-drinks', inStock: true, quantity: 120 },
  { id: '4', name: 'Amul Gold Full Cream Milk', description: 'Pure & fresh full cream milk', price: 28, image: '/products/dairy-bread/amul-milk.webp', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 80 },
  { id: '5', name: 'Britannia Bread', description: 'Soft & fresh bread', price: 35, image: '/products/dairy-bread/britannia-bread.webp', brand: 'Britannia', category: 'dairy-bread', inStock: true, quantity: 60 },
  { id: '6', name: 'Amul Butter', description: 'Premium quality butter', price: 55, image: '/products/dairy-bread/amul-butter.webp', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 40 },
  { id: '7', name: "Lay's Classic Salted", description: 'Crispy potato chips', price: 20, image: '/products/snacks-munchies/lays.webp', brand: "Lay's", category: 'snacks-munchies', inStock: true, quantity: 90 },
  { id: '8', name: 'Kurkure Masala Munch', description: 'Spicy corn puffs', price: 20, image: '/products/snacks-munchies/kurkure.webp', brand: 'Kurkure', category: 'snacks-munchies', inStock: true, quantity: 70 },
  { id: '9', name: 'Maggi Noodles', description: 'Instant noodles', price: 20, image: '/products/instant-food/maggi.webp', brand: 'Nestle', category: 'instant-food', inStock: true, quantity: 100 },
  { id: '10', name: 'Parle-G Biscuits', description: 'Sweet biscuits', price: 10, image: '/products/snacks-munchies/parle-g.webp', brand: 'Parle', category: 'snacks-munchies', inStock: true, quantity: 150 },
  { id: '11', name: 'Amul Ice Cream', description: 'Creamy vanilla ice cream', price: 60, image: '/products/ice-creams/amul-icecream.webp', brand: 'Amul', category: 'ice-creams', inStock: true, quantity: 30 },
  { id: '12', name: 'Haldiram Bhujia', description: 'Spicy namkeen', price: 50, image: '/products/snacks-munchies/haldiram.webp', brand: 'Haldiram', category: 'snacks-munchies', inStock: true, quantity: 45 },
];

const fetchProducts = async (category: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (category === 'all') return ALL_PRODUCTS;
  return ALL_PRODUCTS.filter(p => p.category === category);
};

function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQuantity } = useCartStore();
  const { rainMode } = useSystemStore();
  
  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find(i => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  const quantity = getItemQuantity(product.id);
  const finalPrice = rainMode ? Math.round(product.price * 1.1) : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-40 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {product.category === 'cold-drinks' && '🥤'}
          {product.category === 'dairy-bread' && '🥛'}
          {product.category === 'snacks-munchies' && '🍿'}
          {product.category === 'instant-food' && '🍜'}
          {product.category === 'ice-creams' && '🍦'}
          {!['cold-drinks', 'dairy-bread', 'snacks-munchies', 'instant-food', 'ice-creams'].includes(product.category) && '📦'}
        </div>
        {rainMode && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg">
            +10%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(finalPrice)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          {quantity === 0 ? (
            <button
              onClick={() => addItem({
                id: product.id,
                name: product.name,
                price: finalPrice,
                image: product.image,
                type: 'product',
              })}
              disabled={!product.inStock}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                product.inStock
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add
            </button>
          ) : (
            <motion.div 
              className="flex items-center justify-center gap-1 bg-green-500 rounded-xl overflow-hidden"
              initial={false}
            >
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex-1 h-10 flex items-center justify-center text-white font-bold text-lg hover:bg-green-600 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-white font-semibold text-center">{quantity}</span>
              <button
                onClick={() => addItem({
                  id: product.id,
                  name: product.name,
                  price: finalPrice,
                  image: product.image,
                  type: 'product',
                })}
                className="flex-1 h-10 flex items-center justify-center text-white font-bold text-lg hover:bg-green-600 transition-colors"
              >
                +
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const currentCategory = CATEGORIES.find(c => c.id === slug);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', slug],
    queryFn: () => fetchProducts(slug),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = debouncedQuery
    ? products.filter(p => 
        p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : products;

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold">Category not found</h2>
          <Link href="/quickmart" className="text-green-500 hover:underline mt-2 inline-block">
            Back to QuickMart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${currentCategory.color} pb-6 pt-4`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/quickmart"
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="text-4xl">{currentCategory.icon}</div>
            <h1 className="text-3xl font-bold text-white">{currentCategory.name}</h1>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${currentCategory.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white rounded-xl border-0 focus:ring-2 focus:ring-white/50"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/quickmart/category/${cat.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      cat.id === slug 
                        ? 'bg-green-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <main className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {filteredProducts.length} products
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
