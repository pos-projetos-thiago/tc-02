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
                <img 
                  src={service.icon} 
                  alt=""
                  width={60}
                  height={60}
                />
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