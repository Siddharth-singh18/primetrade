'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken || !user) {
      router.push('/login');
      return;
    }

    if (requireAdmin && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, accessToken, router, requireAdmin, pathname]);

  if (!accessToken || !user) {
    return null; // Or a loading spinner
  }

  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};
