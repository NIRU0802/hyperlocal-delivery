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
  { id: '1', name: 'Paper Boat Aamras Mango Juice', description: 'Rich & delicious mango pulp', price: 45, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', brand: 'Paper Boat', category: 'cold-drinks', inStock: true, quantity: 50 },
  { id: '2', name: 'Thums Up Soft Drink', description: 'Refreshing aerated drink', price: 40, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', brand: 'Coca-Cola', category: 'cold-drinks', inStock: true, quantity: 100 },
  { id: '3', name: 'Pepsi', description: 'Bold cola flavor', price: 35, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', brand: 'PepsiCo', category: 'cold-drinks', inStock: true, quantity: 120 },
  { id: '4', name: 'Amul Gold Full Cream Milk', description: 'Pure & fresh full cream milk', price: 28, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 80 },
  { id: '5', name: 'Britannia Bread', description: 'Soft & fresh bread', price: 35, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', brand: 'Britannia', category: 'dairy-bread', inStock: true, quantity: 60 },
  { id: '6', name: 'Amul Butter', description: 'Premium quality butter', price: 55, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 40 },
  { id: '7', name: "Lay's Classic Salted", description: 'Crispy potato chips', price: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', brand: "Lay's", category: 'snacks-munchies', inStock: true, quantity: 90 },
  { id: '8', name: 'Kurkure Masala Munch', description: 'Spicy corn puffs', price: 20, image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400', brand: 'Kurkure', category: 'snacks-munchies', inStock: true, quantity: 70 },
  { id: '9', name: 'Maggi Noodles', description: 'Instant noodles', price: 20, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', brand: 'Nestle', category: 'instant-food', inStock: true, quantity: 100 },
  { id: '10', name: 'Parle-G Biscuits', description: 'Sweet biscuits', price: 10, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', brand: 'Parle', category: 'snacks-munchies', inStock: true, quantity: 150 },
  { id: '11', name: 'Amul Ice Cream', description: 'Creamy vanilla ice cream', price: 60, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', brand: 'Amul', category: 'ice-creams', inStock: true, quantity: 30 },
  { id: '12', name: 'Haldiram Bhujia', description: 'Spicy namkeen', price: 50, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', brand: 'Haldiram', category: 'snacks-munchies', inStock: true, quantity: 45 },
  
  { id: '13', name: 'Fresh Bananas', description: 'Organic bananas (1 dozen)', price: 60, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 40 },
  { id: '14', name: 'Fresh Apples', description: 'Imported apples (1kg)', price: 220, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 25 },
  { id: '15', name: 'Organic Oranges', description: 'Sweet oranges (1kg)', price: 150, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 30 },
  { id: '16', name: 'Fresh Potatoes', description: 'Premium potatoes (1kg)', price: 35, image: 'https://images.unsplash.com/photo-1518977676601-b53f82be8f65?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 60 },
  { id: '17', name: 'Fresh Tomatoes', description: 'Red tomatoes (1kg)', price: 50, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 45 },
  { id: '18', name: 'Fresh Onions', description: 'Yellow onions (1kg)', price: 45, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 55 },
  { id: '19', name: 'Fresh Spinach', description: 'Green spinach (bunch)', price: 25, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 30 },
  { id: '20', name: 'Fresh Carrots', description: 'Orange carrots (500g)', price: 40, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', brand: 'Fresh', category: 'fruits-vegetables', inStock: true, quantity: 35 },
  
  { id: '21', name: 'Amul Dahi', description: 'Fresh curd 400g', price: 45, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 50 },
  { id: '22', name: 'Amul Paneer', description: 'Fresh cottage cheese 400g', price: 180, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400', brand: 'Amul', category: 'dairy-bread', inStock: true, quantity: 20 },
  { id: '23', name: 'Farm Fresh Eggs', description: 'Brown eggs (12 pieces)', price: 90, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', brand: 'Farm Fresh', category: 'dairy-bread', inStock: true, quantity: 100 },
  { id: '24', name: 'Britannia Good Day', description: 'Butter cookies 600g', price: 80, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', brand: 'Britannia', category: 'snacks-munchies', inStock: true, quantity: 40 },
  { id: '25', name: 'Sunfeast Dark Fantasy', description: 'Choco cream biscuits', price: 120, image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400', brand: 'Sunfeast', category: 'snacks-munchies', inStock: true, quantity: 35 },
  { id: '26', name: 'Doritos Nachos', description: 'Cheese flavored chips', price: 120, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400', brand: 'Doritos', category: 'snacks-munchies', inStock: true, quantity: 30 },
  
  { id: '27', name: 'Kellogg\'s Corn Flakes', description: 'Breakfast cereal 750g', price: 320, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400', brand: "Kellogg's", category: 'breakfast-cereals', inStock: true, quantity: 25 },
  { id: '28', name: 'Quaker Oats', description: 'Rolled oats 1kg', price: 250, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400', brand: 'Quaker', category: 'breakfast-cereals', inStock: true, quantity: 30 },
  { id: '29', name: 'Oreo Biscuits', description: 'Cream filled biscuits', price: 45, image: 'https://images.unsplash.com/photo-1590080875897-6e82de783a3c?w=400', brand: 'Oreo', category: 'snacks-munchies', inStock: true, quantity: 70 },
  { id: '30', name: 'Bournvita', description: 'Chocolate drink 500g', price: 280, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400', brand: 'Bournvita', category: 'breakfast-cereals', inStock: true, quantity: 25 },
  
  { id: '31', name: 'Colgate Toothpaste', description: 'Advanced white 200g', price: 180, image: 'https://images.unsplash.com/photo-1585456656176-6a0d4f9d1c7f?w=400', brand: 'Colgate', category: 'personal-care', inStock: true, quantity: 50 },
  { id: '32', name: 'Dove Soap', description: 'Beauty bar 4 pieces', price: 120, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400', brand: 'Dove', category: 'personal-care', inStock: true, quantity: 45 },
  { id: '33', name: 'Shampoo Head & Shoulders', description: 'Anti-dandruff 650ml', price: 450, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', brand: 'Head & Shoulders', category: 'personal-care', inStock: true, quantity: 20 },
  { id: '34', name: 'Hair Oil Almond', description: 'Almond oil 300ml', price: 280, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400', brand: 'Almond', category: 'personal-care', inStock: true, quantity: 25 },
  { id: '35', name: 'Face Wash', description: 'Gentle cleansing 100g', price: 150, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', brand: 'Himalaya', category: 'personal-care', inStock: true, quantity: 30 },
  { id: '36', name: 'Deodorant', description: 'Long lasting 150ml', price: 200, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400', brand: 'Fogg', category: 'personal-care', inStock: true, quantity: 35 },
  
  { id: '37', name: 'Tide Detergent Powder', description: 'Washing powder 1kg', price: 160, image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', brand: 'Tide', category: 'cleaning-essentials', inStock: true, quantity: 40 },
  { id: '38', name: 'Lizol Floor Cleaner', description: 'Disinfectant 1L', price: 220, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', brand: 'Lizol', category: 'cleaning-essentials', inStock: true, quantity: 30 },
  { id: '39', name: 'Toilet Cleaner', description: 'Liquid cleaner 500ml', price: 180, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', brand: 'Harpic', category: 'cleaning-essentials', inStock: true, quantity: 30 },
  { id: '40', name: 'Dishwash Liquid', description: 'Dish cleaning 500ml', price: 150, image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400', brand: 'Vim', category: 'cleaning-essentials', inStock: true, quantity: 35 },
  { id: '41', name: 'Detergent Bar', description: 'Laundry soap 5 pieces', price: 60, image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', brand: 'Wheel', category: 'cleaning-essentials', inStock: true, quantity: 50 },
  { id: '42', name: 'Air Freshener', description: 'Lavender scent 400ml', price: 250, image: 'https://images.unsplash.com/photo-1523369448795-716a95a7ef97?w=400', brand: 'Glade', category: 'cleaning-essentials', inStock: true, quantity: 25 },
  
  { id: '43', name: 'Instant Coffee', description: 'Instant coffee 50g', price: 180, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', brand: 'Nescafe', category: 'instant-food', inStock: true, quantity: 25 },
  { id: '44', name: 'Instant Pasta', description: 'Quick cooking pasta', price: 90, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400', brand: 'Pasta', category: 'instant-food', inStock: true, quantity: 30 },
  { id: '45', name: 'Paratha Frozen', description: 'Aloo paratha 5pc', price: 120, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', brand: 'Frozen', category: 'instant-food', inStock: true, quantity: 20 },
  
  { id: '46', name: 'Sprite', description: 'Lemon lime drink 600ml', price: 50, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', brand: 'Coca-Cola', category: 'cold-drinks', inStock: true, quantity: 85 },
  { id: '47', name: 'Frooti', description: 'Mango drink 1L', price: 90, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', brand: 'Parle', category: 'cold-drinks', inStock: true, quantity: 40 },
  { id: '48', name: 'Red Bull', description: 'Energy drink 250ml', price: 150, image: 'https://images.unsplash.com/photo-1629292827662-2a9a93c1d36d?w=400', brand: 'Red Bull', category: 'cold-drinks', inStock: true, quantity: 40 },
  
  { id: '49', name: 'Ice Cream Vanilla', description: 'Premium vanilla 500ml', price: 150, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', brand: 'Baskin Robbins', category: 'ice-creams', inStock: true, quantity: 20 },
  { id: '50', name: 'Magnum Ice Cream', description: 'Double chocolate', price: 100, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', brand: 'Magnum', category: 'ice-creams', inStock: true, quantity: 25 },
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
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {product.category === 'cold-drinks' && '🥤'}
            {product.category === 'dairy-bread' && '🥛'}
            {product.category === 'snacks-munchies' && '🍿'}
            {product.category === 'instant-food' && '🍜'}
            {product.category === 'ice-creams' && '🍦'}
            {product.category === 'fruits-vegetables' && '🥬'}
            {product.category === 'breakfast-cereals' && '🥣'}
            {product.category === 'personal-care' && '🧴'}
            {product.category === 'cleaning-essentials' && '🧹'}
            {!['cold-drinks', 'dairy-bread', 'snacks-munchies', 'instant-food', 'ice-creams', 'fruits-vegetables', 'breakfast-cereals', 'personal-care', 'cleaning-essentials'].includes(product.category) && '📦'}
          </div>
        )}
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
