'use client';

/**
 * TransactionsParcel
 *
 * Conecta o contexto do shell ao parcel do remote transactions.
 * Passa transactions, onEdit, onDelete e onNavigate como props ao parcel.
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ParcelWrapper } from './ParcelWrapper';
import { useDashboard } from '@/contexts/DashboardContextJWT';

const SPA_URL = process.env.NEXT_PUBLIC_TRANSACTIONS_SPA_URL ?? 'http://localhost:3002/spa.js';

export const TransactionsParcel: React.FC = () => {
  const { transactions, editTransaction, deleteTransaction } = useDashboard();
  const router = useRouter();

  console.log('[LOG] 🧾 TransactionsParcel RENDER', { txCount: transactions.length });
  
  const customProps = useMemo(
    () => ({
      transactions,
      onEdit: (id: string, updates: Record<string, unknown>) =>
        editTransaction(id, updates),
      onDelete: (id: string) => deleteTransaction(id),
      onNavigate: (path: string) => router.push(path),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions],
  );

  return (
    <ParcelWrapper
      spaUrl={SPA_URL}
      name="transactions"
      customProps={customProps}
      fallback={<span>Carregando extrato...</span>}
    />
  );
};
