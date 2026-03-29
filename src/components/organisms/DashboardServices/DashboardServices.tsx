'use client';

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

export const DashboardServices = ({ services = defaultServices }: DashboardServicesProps) => {
  const { activeSection } = useDashboard();

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
              <h2 className={styles.title}>Transferências</h2>
            </header>
            <div className={styles['empty-state']}>
              <p className={styles['empty-message']}>
                Área de transferências em desenvolvimento...
              </p>
              <p className={styles['empty-subtitle']}>
                Em breve você poderá realizar PIX, TED, DOC e transferências internas.
              </p>
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