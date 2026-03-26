'use client';

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
    title: 'Nova Transação',
    description: 'Depósito, transferência ou saque',
    icon: '💰'
  },
  {
    id: '2',
    title: 'Extrato Completo',
    description: 'Visualize todas suas transações',
    icon: '📋'
  },
  {
    id: '3',
    title: 'Configurações',
    description: 'Gerencie sua conta e preferências',
    icon: '⚙️'
  }
];

export const DashboardServices = ({ services = defaultServices }: DashboardServicesProps) => {
  return (
    <section className={styles.services}>
      <header className={styles.header}>
        <h2 className={styles.title}>Confira os serviços disponíveis</h2>
      </header>

      <ul className={styles['service-grid']}>
        {services.map((service) => (
          <li key={service.id}>
            <article
              className={styles['service-card']}
              onClick={service.action}
              role={service.action ? "button" : undefined}
              tabIndex={service.action ? 0 : undefined}
            >
              <div className={styles['service-icon']} aria-hidden="true">
                {service.icon}
              </div>
              <div className={styles['service-content']}>
                <h3 className={styles['service-title']}>{service.title}</h3>
                <p className={styles['service-description']}>{service.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};