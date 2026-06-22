'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Dropdown, type DropdownOption } from '@/components/atoms/Dropdown';
import { CurrencyInput } from '@/components/atoms/Input';
import { TransactionButton } from '@/components/atoms/TransactionButton';
import { ButtonGroup, type ButtonOption } from '@/components/atoms/ButtonGroup';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { InvestmentChart } from '@/components/molecules/InvestmentChart';
import { useDashboard } from '@/contexts/DashboardContextJWT';
import { useAuth } from '@/hooks/useJWTAuth';
import styles from './DashboardServices.module.scss';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
}

export interface DashboardServicesProps {
  services?: Service[];
  userName?: string;
}

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'OCR Transações',
    description: 'Crie transações por comprovante',
    icon: '/DashboardServices/ocr.svg'
  },
  {
    id: '2',
    title: 'Empréstimo',
    description: '',
    icon: '/DashboardServices/emprestimo.svg'
  },
    {
      id: 'cartoes',
      title: 'Meus cartões',
      description: '',
      icon: '/DashboardServices/cartao.svg'
    },
    {
      id: 'doacoes',
      title: 'Doações',
      description: '',
      icon: '/DashboardServices/doacoes.svg'
    },
    {
      id: 'pix',
      title: 'Pix',
      description: '',
      icon: '/DashboardServices/pix.svg'
    },
    {
      id: 'seguros',
      title: 'Seguros',
      description: '',
      icon: '/DashboardServices/seguros.svg'
    },
    {
      id: 'celular',
      title: 'Crédito celular',
      description: '',
      icon: '/DashboardServices/celular.svg'
    }
];

const transactionOptions: DropdownOption[] = [
  { value: 'deposit', label: 'Depósito' },
  { value: 'withdrawal', label: 'Saque' },
  { value: 'investment', label: 'Investimento' }
];

const investmentOptions: ButtonOption[] = [
  {
    value: 'investment-fundos',
    label: 'Fundos',
    color: '#2567F9'
  },
  {
    value: 'investment-tesouro-direto',
    label: 'Tesouro',
    color: '#8F3CFF'
  },
  {
    value: 'investment-previdencia',
    label: 'Previdência',
    color: '#FF3C82'
  },
  {
    value: 'investment-bolsa',
    label: 'Bolsa',
    color: '#F1823D'
  }
];

export const DashboardServices = ({ services = defaultServices, userName = "Usuário" }: DashboardServicesProps) => {
  const { activeSection, addTransaction, transactions, setActiveSection, balance } = useDashboard();
  const { user } = useAuth();
  const router = useRouter();
  
  const displayName = user?.username || userName;
  
  const servicesWithActions: Service[] = [
    {
      id: 'controle-financeiro',
      title: 'Controle Financeiro',
      description: '',
      icon: '/DashboardServices/emprestimo.svg',
      action: () => router.push('/dashboard/ai-documents')
    },
    {
      id: '2',
      title: 'Meus cartões',
      description: '',
      icon: '/DashboardServices/cartao.svg',
      action: () => setActiveSection('cards')
    },
    {
      id: '3',
      title: 'Doações',
      description: '',
      icon: '/DashboardServices/doacoes.svg'
    },
    {
      id: '4',
      title: 'Pix',
      description: '',
      icon: '/DashboardServices/pix.svg'
    },
    {
      id: '5',
      title: 'Seguros',
      description: '',
      icon: '/DashboardServices/seguros.svg'
    },
    {
      id: '6',
      title: 'Crédito celular',
      description: '',
      icon: '/DashboardServices/celular.svg'
    }
  ];

  const currentServices = services === defaultServices ? servicesWithActions : services;
  const [selectedType, setSelectedType] = useState('');
  const [selectedInvestmentType, setSelectedInvestmentType] = useState('');
  const [amount, setAmount] = useState('');

  const totalInvestments = transactions
    .filter(transaction => transaction.type === 'investment')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const rendaFixa = transactions
    .filter(transaction =>
      transaction.type === 'investment' &&
      (transaction.investmentType === 'tesouro-direto' ||
        transaction.investmentType === 'previdencia' ||
        transaction.subtype === 'renda-fixa')
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const rendaVariavel = transactions
    .filter(transaction =>
      transaction.type === 'investment' &&
      (transaction.investmentType === 'fundos' ||
        transaction.investmentType === 'bolsa' ||
        transaction.subtype === 'renda-variavel')
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isValidAmount = (value: string): boolean => {
    if (!value || value.trim() === '') return false;
    const numericValue = parseFloat(value.replace(',', '.'));
    return !isNaN(numericValue) && numericValue > 0;
  };

  const canSubmitTransaction = () => {
    if (!selectedType || !isValidAmount(amount)) return false;
    if (selectedType === 'investment' && !selectedInvestmentType) return false;
    
    // Validação de saldo: só permite se for depósito OU se o valor for menor/igual ao saldo
    if (selectedType !== 'deposit') {
      const numericAmount = parseFloat(amount.replace(',', '.'));
      if (numericAmount > balance) {
        return false; // Saldo insuficiente para operações que não são depósito
      }
    }
    
    return true;
  };

  const handleTransaction = () => {
    if (!selectedType || !amount) return;

    if (selectedType === 'investment' && !selectedInvestmentType) return;

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!numericAmount || numericAmount <= 0) return;

    const transactionType = selectedType === 'investment' ? selectedInvestmentType : selectedType;
    addTransaction(transactionType, numericAmount);

    setSelectedType('');
    setSelectedInvestmentType('');
    setAmount('');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'services':
      default:
        return (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Confira os serviços disponíveis</h2>
            </header>
            <ul className={styles['service-grid']}>
              {currentServices.map((service: Service) => (
                <li key={service.id}>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    onClick={service.action}
                  />
                </li>
              ))}
            </ul>
          </>
        );

      case 'transfers':
        return (
          <>
            <header className={styles.header}>
              <h2 className={`${styles.title} ${styles['transaction-title']}`}>Nova transação</h2>
            </header>
            <div className={styles['transaction-container']}>
              <div className={styles['transaction-form']}>
                <Dropdown
                  options={transactionOptions}
                  placeholder="Selecione o tipo de transação"
                  value={selectedType}
                  onChange={(value) => {
                    setSelectedType(value);
                    if (value !== 'investment') {
                      setSelectedInvestmentType('');
                    }
                  }}
                />

                {selectedType === 'investment' && (
                  <ButtonGroup
                    options={investmentOptions}
                    value={selectedInvestmentType}
                    onChange={setSelectedInvestmentType}
                  />
                )}

                <div className={styles['value-section']}>
                  <h3 className={styles['value-title']}>Valor</h3>
                  <CurrencyInput
                    placeholder="0,00"
                    value={amount}
                    onChange={setAmount}
                  />
                </div>

                <TransactionButton
                  onClick={handleTransaction}
                  disabled={!canSubmitTransaction()}
                >
                  Concluir transação
                </TransactionButton>
              </div>

              <div className={styles['transaction-illustration']}>
                <Image
                  src="/Transference/transference.svg"
                  alt="Ilustração de transferência financeira"
                  width={328}
                  height={231}
                  className={styles['illustration-image']}
                  priority
                />
              </div>
            </div>
          </>
        );

      case 'investments':
        return (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Investimentos</h2>
            </header>
            <div className={styles['investment-total']}>
              <p className={styles['total-label']}>Total:</p>
              <p className={styles['total-value']}>
                {formatCurrency(totalInvestments)}
              </p>
            </div>

            <div className={styles['investment-categories']}>
              <div className={styles['investment-card']}>
                <h3 className={styles['card-title']}>Renda Fixa</h3>
                <p className={styles['card-value']}>
                  {formatCurrency(rendaFixa)}
                </p>
              </div>

              <div className={styles['investment-card']}>
                <h3 className={styles['card-title']}>Renda Variável</h3>
                <p className={styles['card-value']}>
                  {formatCurrency(rendaVariavel)}
                </p>
              </div>
            </div>

            <div className={styles['statistics-section']}>
              <div className={styles['statistics-header']}>
                <h3 className={styles['statistics-label']}>Estatísticas</h3>
              </div>
              <div className={styles['statistics-wrapper']}>
                <div className={styles['statistics-card']}>
                  <InvestmentChart transactions={transactions} />
                </div>
              </div>
            </div>
          </>
        );

      case 'cards':
        return (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Meus cartões</h2>
            </header>
            
            <div className={styles['cards-container']}>
              <div className={styles['card-section']}>
                <h3 className={styles['card-type-title']}>Cartão digital</h3>
                
                <div className={styles['card-layout']}>
                  <div className={styles['card-display']}>
                    <div className={styles['card-logo']}>
                      <Image
                        src="/DashboardServices/logo-card.svg"
                        alt="Logo Byte"
                        width={100}
                        height={60}
                        className={styles['logo-img']}
                      />
                    </div>
                    
                    <div className={styles['card-info']}>
                      <p className={styles['card-holder']}>{displayName}</p>
                      <p className={styles['card-number']}>•••••••</p>
                    </div>
                  </div>
                  
                  <div className={styles['card-actions-side']}>
                    <button className={styles['btn-configure']}>
                      Configurar
                    </button>
                    <button className={styles['btn-block']}>
                      Bloquear
                    </button>
                    <p className={styles['card-function']}>
                      Função: Débito/Crédito
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'others':
        return (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Outros Serviços</h2>
            </header>
            <div className={styles['empty-state']}>
              <p className={styles['empty-message']}>
                Outros serviços em desenvolvimento...
              </p>
              <p className={styles['empty-subtitle']}>
                Em breve você poderá acessar mais funcionalidades bancárias.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <section className={styles.services}>
      {renderContent()}
    </section>
  );
};