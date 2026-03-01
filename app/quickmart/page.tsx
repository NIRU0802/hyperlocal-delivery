'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { 
    id: 'fruits-vegetables', 
    name: 'Fruits & Vegetables', 
    icon: '🥬', 
    color: 'from-green-500 to-emerald-500',
    itemCount: 20
  },
  { 
    id: 'dairy-bread', 
    name: 'Dairy & Bread', 
    icon: '🥛', 
    color: 'from-blue-500 to-cyan-500',
    itemCount: 10
  },
  { 
    id: 'cold-drinks', 
    name: 'Cold Drinks', 
    icon: '🥤', 
    color: 'from-purple-500 to-pink-500',
    itemCount: 10
  },
  { 
    id: 'snacks-munchies', 
    name: 'Snacks & Munchies', 
    icon: '🍿', 
    color: 'from-yellow-500 to-orange-500',
    itemCount: 12
  },
  { 
    id: 'instant-food', 
    name: 'Instant Food', 
    icon: '🍜', 
    color: 'from-red-500 to-rose-500',
    itemCount: 8
  },
  { 
    id: 'breakfast-cereals', 
    name: 'Breakfast & Cereals', 
    icon: '🥣', 
    color: 'from-amber-500 to-yellow-500',
    itemCount: 5
  },
  { 
    id: 'ice-creams', 
    name: 'Ice Creams', 
    icon: '🍦', 
    color: 'from-pink-500 to-rose-500',
    itemCount: 4
  },
  { 
    id: 'personal-care', 
    name: 'Personal Care', 
    icon: '🧴', 
    color: 'from-violet-500 to-purple-500',
    itemCount: 6
  },
  { 
    id: 'cleaning-essentials', 
    name: 'Cleaning Essentials', 
    icon: '🧹', 
    color: 'from-teal-500 to-cyan-500',
    itemCount: 6
  },
];

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/quickmart/category/${category.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
            <span className="text-6xl">{category.icon}</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.itemCount} items</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function QuickMartPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 pb-8 pt-4">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-10 w-40 bg-white/20 rounded animate-pulse mb-2" />
            <div className="h-6 w-56 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 pb-8 pt-4">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🛒</span>
              <h1 className="text-3xl font-bold">QuickMart</h1>
            </div>
            <p className="text-white/80">Groceries delivered instantly</p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
