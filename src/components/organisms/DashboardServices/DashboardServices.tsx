'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Dropdown, type DropdownOption } from '@/components/atoms/Dropdown';
import { CurrencyInput } from '@/components/atoms/Input';
import { TransactionButton } from '@/components/atoms/TransactionButton';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { useDashboard } from '@/contexts/DashboardContext';
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
}

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Empréstimo',
    description: '',
    icon: '/DashboardServices/emprestimo.svg'
  },
  {
    id: '2',
    title: 'Meus cartões',
    description: '',
    icon: '/DashboardServices/cartao.svg'
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

const transactionOptions: DropdownOption[] = [
  { value: 'deposit', label: 'Depósito' },
  { value: 'withdrawal', label: 'Saque' },
  { value: 'investment-renda-fixa', label: 'Investimento - Renda Fixa' },
  { value: 'investment-renda-variavel', label: 'Investimento - Renda Variável' }
];

export const DashboardServices = ({ services = defaultServices }: DashboardServicesProps) => {
  const { activeSection, addTransaction, transactions } = useDashboard();
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');

  const totalInvestments = transactions
    .filter(transaction => transaction.type === 'investment')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const rendaFixa = transactions
    .filter(transaction => transaction.type === 'investment' && transaction.subtype === 'renda-fixa')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const rendaVariavel = transactions
    .filter(transaction => transaction.type === 'investment' && transaction.subtype === 'renda-variavel')
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

  const handleTransaction = () => {
    if (!selectedType || !amount) return;

    const numericAmount = parseFloat(amount.replace(',', '.'));

    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    addTransaction(selectedType, numericAmount);

    setSelectedType('');
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
              {services.map((service) => (
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
                  onChange={setSelectedType}
                />

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
                  disabled={!selectedType || !isValidAmount(amount)}
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