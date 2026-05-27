'use client';

import { AuthProvider } from '@/hooks/useJWTAuth';
import { DashboardProvider } from '@/contexts/DashboardContextJWT';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </AuthProvider>
  );
}
