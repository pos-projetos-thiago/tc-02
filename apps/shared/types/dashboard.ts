// Dashboard types
export type DashboardSection = 'services' | 'transfers' | 'investments' | 'cards' | 'others';

export interface BalanceInfo {
  amount: number;
  visible: boolean;
}

export interface DashboardState {
  activeSection: DashboardSection;
  balance: BalanceInfo;
  transactions: Transaction[];
  user: User | null;
  loading: boolean;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
  disabled?: boolean;
}

import type { Transaction } from './transaction';
import type { User } from './user';