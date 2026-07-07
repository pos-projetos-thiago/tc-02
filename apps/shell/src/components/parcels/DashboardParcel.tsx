'use client';

/**
 * DashboardParcel
 *
 * Conecta o contexto do shell ao parcel do remote dashboard.
 * Lê dados de useDashboard() e os passa como customProps ao ParcelWrapper.
 *
 * Não substitui nenhuma página — é usado dentro de dashboard/page.tsx
 * no lugar dos componentes DashboardNav + DashboardServices + DashboardExtract.
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ParcelWrapper } from './ParcelWrapper';
import { useDashboard, type DashboardSection } from '@/contexts/DashboardContextJWT';

const SPA_URL = process.env.NEXT_PUBLIC_DASHBOARD_SPA_URL ?? 'http://localhost:3001/spa.js';

export const DashboardParcel: React.FC = () => {
  const {
    balance,
    transactions,
    activeSection,
    setActiveSection,
    addTransaction,
  } = useDashboard();

  const router = useRouter();

  console.log('[LOG] 🧩 DashboardParcel RENDER', { balance, txCount: transactions.length, activeSection });
  const customProps = useMemo(
    () => ({
      balance,
      transactions,
      activeSection,
      onSectionChange: (section: string) =>
        setActiveSection(section as DashboardSection),
      onNavigate: (path: string) => router.push(path),
      onAddTransaction: (type: string, amount: number) =>
        addTransaction(type, amount),
    }),
    // transactions e balance mudam por valor; activeSection por string
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, transactions, activeSection],
  );

  return (
    <ParcelWrapper
      spaUrl={SPA_URL}
      name="dashboard"
      customProps={customProps}
      fallback={<span>Carregando dashboard...</span>}
    />
  );
};
