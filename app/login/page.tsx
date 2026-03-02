'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'user':
        return '/home';
      case 'rider':
        return '/rider/dashboard';
      case 'quickbite_admin':
        return '/admin/quickbite';
      case 'quickmart_admin':
        return '/admin/quickmart';
      default:
        return '/home';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      const role = email.split('@')[0];
      const redirectPath = getRedirectPath(role);
      router.push(redirectPath);
    } else {
      setError('Invalid credentials. Try the quick login buttons below.');
    }
    setLoading(false);
  };

  const quickLogin = async (role: 'user' | 'rider' | 'quickbite_admin' | 'quickmart_admin') => {
    setLoading(true);
    const emails: Record<string, string> = {
      user: 'user@quickbite.com',
      rider: 'rider@quickbite.com',
      quickbite_admin: 'quickbite@admin.com',
      quickmart_admin: 'quickmart@admin.com',
    };

    await login(emails[role], '123456');
    router.push(getRedirectPath(role));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
            <span className="text-3xl font-black text-white">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-white">THE QUICK</h1>
          <p className="text-gray-400 mt-2">Sign in to continue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="user@quickbite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="123456"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center mb-4">Quick login as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin('user')}
                disabled={loading}
                className="py-3 px-4 text-sm bg-gray-700/50 border border-gray-600 rounded-xl text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>👤</span> Customer
              </button>
              <button
                onClick={() => quickLogin('rider')}
                disabled={loading}
                className="py-3 px-4 text-sm bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>🛵</span> Rider
              </button>
              <button
                onClick={() => quickLogin('quickbite_admin')}
                disabled={loading}
                className="py-3 px-4 text-sm bg-orange-600/20 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>🍔</span> QuickBite Admin
              </button>
              <button
                onClick={() => quickLogin('quickmart_admin')}
                disabled={loading}
                className="py-3 px-4 text-sm bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>🛒</span> QuickMart Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Password for all accounts: <code className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">123456</code>
        </p>
      </div>
    </div>
  );
}
