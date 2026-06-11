'use client';

import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  return (
    <nav className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1f1f1f] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-[#7c3aed] flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">TaskFlow</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              {user.role === 'admin' && (
                <Link href="/dashboard/admin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-3 border-l border-[#1f1f1f] pl-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-white font-medium">{user.email}</span>
                  <span className="text-xs text-[#7c3aed] uppercase tracking-wider font-semibold">{user.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-zinc-400">
                  <UserIcon size={20} />
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-400/10"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
