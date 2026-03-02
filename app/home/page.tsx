'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

const services = [
  {
    id: 'quickbite',
    title: 'QuickBite',
    subtitle: 'Hot meals from nearby restaurants',
    description: 'Order from your favorite restaurants and get delivered in minutes',
    icon: '🍔',
    bgGradient: 'from-orange-500 via-red-500 to-pink-500',
    hoverGradient: 'hover:from-orange-400 hover:via-red-400 hover:to-pink-400',
    borderGlow: 'group-hover:shadow-orange-500/50',
    link: '/quickbite',
    cta: 'Explore Restaurants',
    features: ['Fast Delivery', 'Hot Food', 'Live Tracking'],
  },
  {
    id: 'quickmart',
    title: 'QuickMart',
    subtitle: 'Groceries delivered instantly',
    description: 'Fresh groceries, snacks, and essentials at your doorstep',
    icon: '🛒',
    bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
    hoverGradient: 'hover:from-green-400 hover:via-emerald-400 hover:to-teal-400',
    borderGlow: 'group-hover:shadow-green-500/50',
    link: '/quickmart',
    cta: 'Shop Groceries',
    features: ['Instant Delivery', 'Fresh Produce', '24/7 Service'],
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
    >
      <Link
        href={service.link}
        className={`group relative block overflow-hidden rounded-3xl transition-all duration-500 ${service.hoverGradient}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`} />
        
        <div className="relative p-8 min-h-[300px] flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                className="text-5xl mb-4"
                animate={{ y: isHovered ? -5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                {service.title}
              </h2>
              <p className="text-lg text-white/90 font-medium mb-3">
                {service.subtitle}
              </p>
              <p className="text-white/70 text-sm max-w-xs">
                {service.description}
              </p>
            </div>
            
            <motion.div
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {service.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium backdrop-blur-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
            
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {service.cta}
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
        </div>

        <motion.div
          className={`absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none transition-opacity duration-300 ${service.borderGlow} shadow-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const gradientFrom = 'from-orange-500';
  const gradientTo = 'to-red-500';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative z-10">
        <header className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                THE QUICK
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">Welcome, {user?.name}</span>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              What would you like to order?
            </h1>
            <p className="text-xl text-white/70">
              Choose your service below
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
            <p>© 2026 THE QUICK. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
