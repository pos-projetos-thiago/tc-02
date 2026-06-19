import { useMemo } from 'react';
import { useFilterContext } from '@/contexts/FilterContext';
import type { Transaction } from '@/contexts/DashboardContextJWT';

// Função auxiliar para obter texto do tipo de transação
const getTransactionTypeText = (transaction: Transaction): string => {
  if (transaction.type === 'deposit') return 'Depósito';
  if (transaction.type === 'withdrawal') return 'Saque';
  if (transaction.type === 'transfer') return 'Transferência';
  if (transaction.type === 'investment') {
    if (transaction.investmentType === 'fundos') return 'Fundos de investimento';
    if (transaction.investmentType === 'tesouro-direto') return 'Tesouro Direto';
    if (transaction.investmentType === 'previdencia') return 'Previdência Privada';
    if (transaction.investmentType === 'bolsa') return 'Bolsa de Valores';
    if (transaction.subtype === 'renda-fixa') return 'Investimento - Renda Fixa';
    if (transaction.subtype === 'renda-variavel') return 'Investimento - Renda Variável';
    return 'Investimento';
  }
  return transaction.type;
};

export const useFilters = (transactions: Transaction[] = []) => {
  const { filters, pagination, updateFilter, updatePagination, resetFilters } = useFilterContext();

  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    let result = [...transactions];

    // Filtro por busca de texto
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(transaction => {
        const typeText = getTransactionTypeText(transaction).toLowerCase();
        const amount = transaction.amount.toString();
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        
        return typeText.includes(searchTerm) || 
               amount.includes(searchTerm) || 
               date.includes(searchTerm);
      });
    }

    // Filtro por tipo
    if (filters.type.length > 0) {
      result = result.filter(transaction => {
        if (transaction.type === 'investment') {
          // Para investimentos, verificar subtipo ou investmentType
          const investmentType = transaction.investmentType || transaction.subtype || 'investment';
          return filters.type.includes(investmentType);
        }
        return filters.type.includes(transaction.type);
      });
    }

    // Filtro por data
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(filters.dateRange.start!);
        const endDate = new Date(filters.dateRange.end!);
        
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Filtro por valor
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) {
      result = result.filter(transaction => {
        const amount = transaction.amount;
        const min = filters.amountRange.min;
        const max = filters.amountRange.max;
        
        if (min !== null && max !== null) {
          return amount >= min && amount <= max;
        } else if (min !== null) {
          return amount >= min;
        } else if (max !== null) {
          return amount <= max;
        }
        return true;
      });
    }

    // Filtro por tipos de investimento
    if (filters.investmentTypes.length > 0 && filters.type.includes('investment')) {
      result = result.filter(transaction => {
        if (transaction.type !== 'investment') return true;
        const investmentType = transaction.investmentType || transaction.subtype;
        return investmentType && filters.investmentTypes.includes(investmentType);
      });
    }

    return result;
  }, [transactions, filters]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, pagination.currentPage, pagination.itemsPerPage]);

  // Atualizar totais quando filtros mudarem
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  return {
    filters,
    pagination: {
      ...pagination,
      totalItems,
      totalPages,
    },
    filteredTransactions,
    paginatedTransactions,
    updateFilter,
    updatePagination,
    resetFilters,
    getTransactionTypeText,
  };
};