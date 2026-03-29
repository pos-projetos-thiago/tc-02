'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type DashboardSection = 'services' | 'transfers' | 'investments' | 'others';

interface DashboardContextType {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('services');

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de DashboardProvider');
  }
  return context;
}

export type { DashboardSection };