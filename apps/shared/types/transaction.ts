// Types for transactions based on existing context
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment';
  amount: number;
  date: string;
  description?: string;
  subtype?: 'renda-fixa' | 'renda-variavel';
  investmentType?: 'fundos' | 'tesouro-direto' | 'previdencia' | 'bolsa';
}

export interface TransactionFormData {
  type: string;
  amount: string;
  description?: string;
}

export interface InvestmentSummary {
  totalRendaFixa: number;
  totalRendaVariavel: number;
  totalInvestments: number;
  distribution: {
    fundos: number;
    tesouroDireto: number;
    previdencia: number; 
    bolsa: number;
  };
}