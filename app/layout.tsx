import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { CartSidebar } from '@/components/CartSidebar';

export const metadata: Metadata = {
  title: 'THE QUICK - Anything You Crave. Delivered Faster.',
  description: 'QuickBite for food delivery & QuickMart for groceries. Order from the best restaurants and get instant grocery delivery in Nashik.',
  keywords: ['food delivery', 'grocery delivery', 'online ordering', 'restaurants', 'quickmart', 'blinkit', 'swiggy'],
  authors: [{ name: 'THE QUICK' }],
  openGraph: {
    title: 'THE QUICK - Anything You Crave. Delivered Faster.',
    description: 'QuickBite for food delivery & QuickMart for groceries',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          {children}
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
