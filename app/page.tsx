'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const services = [
  {
    id: 'quickbite',
    title: 'QuickBite',
    subtitle: 'Hot meals from nearby restaurants',
    description: 'Order from your favorite restaurants and get delivered in minutes',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    icon: '🛒',
    bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
    hoverGradient: 'hover:from-green-400 hover:via-emerald-400 hover:to-teal-400',
    borderGlow: 'group-hover:shadow-green-500/50',
    link: '/quickmart',
    cta: 'Shop Groceries',
    features: ['Instant Delivery', 'Fresh Produce', '24/7 Service'],
  },
];

const floatingIcons = [
  { emoji: '🍕', delay: 0, x: '10%', y: '20%' },
  { emoji: '🍔', delay: 0.5, x: '85%', y: '15%' },
  { emoji: '🥗', delay: 1, x: '15%', y: '70%' },
  { emoji: '🍟', delay: 1.5, x: '80%', y: '75%' },
  { emoji: '🍎', delay: 2, x: '50%', y: '85%' },
  { emoji: '🥕', delay: 2.5, x: '25%', y: '45%' },
  { emoji: '🍞', delay: 3, x: '70%', y: '50%' },
  { emoji: '🥛', delay: 3.5, x: '45%', y: '25%' },
];

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 via-purple-600 to-green-600 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-tl from-black/20 via-transparent to-black/20" />
      
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          style={{ left: icon.x, top: icon.y }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: icon.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {icon.emoji}
        </motion.div>
      ))}
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.08),transparent_50%)]" />
    </div>
  );
}

function DeliveryPulse() {
  return (
    <motion.div
      className="flex items-center gap-2 text-white/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-1">
        <motion.span
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.span
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-sm font-medium">Delivery in minutes</span>
    </motion.div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
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
        
        <div className="relative p-8 min-h-[340px] flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: isHovered ? -5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-2">
                {service.title}
              </h2>
              <p className="text-xl text-white/90 font-medium mb-3">
                {service.subtitle}
              </p>
              <p className="text-white/70 text-sm max-w-xs">
                {service.description}
              </p>
            </div>
            
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">Q</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-wider">THE QUICK</span>
            </div>
          </motion.div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                THE QUICK
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 font-light mb-8">
                Anything you crave. Delivered Faster.
              </p>
              <DeliveryPulse />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
            <p>© 2026 THE QUICK. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
