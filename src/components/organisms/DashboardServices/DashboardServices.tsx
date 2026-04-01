'use client';

import { useState } from 'react';

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
  { value: 'investment', label: 'Investimento' }
];

export const DashboardServices = ({ services = defaultServices }: DashboardServicesProps) => {
  const { activeSection } = useDashboard();
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransaction = () => {
    if (!selectedType || !amount) return;
    
    // TODO: Implementar lógica de transação
    alert(`Transação ${selectedType}: R$ ${amount}`);
    
    // Reset form
    setSelectedType('');
    setAmount('');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'services':
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
            <div className={styles['transaction-form']}>
              <Dropdown
                options={transactionOptions}
                placeholder="Selecione o tipo de transação"
                onChange={setSelectedType}
              />
              
              <div className={styles['value-section']}>
                <h3 className={styles['value-title']}>Valor</h3>
                <CurrencyInput
                  placeholder="0,00"
                  onChange={setAmount}
                />
              </div>
              
              <TransactionButton 
                onClick={handleTransaction}
                disabled={!selectedType || !amount}
              >
                Concluir transação
              </TransactionButton>
            </div>
          </>
        );

      case 'investments':
        return (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Investimentos</h2>
            </header>
            <div className={styles['empty-state']}>
              <p className={styles['empty-message']}>
                Área de investimentos em desenvolvimento...
              </p>
              <p className={styles['empty-subtitle']}>
                Em breve você poderá acessar CDB, Tesouro Direto, Fundos e mais.
              </p>
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
    }
  };

  return (
    <section className={styles.services}>
      {renderContent()}
    </section>
  );
};