'use client';

import { DashboardProvider } from '../../contexts/DashboardContextJWT';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  console.log('DashboardLayout: renderizando...');
  
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}