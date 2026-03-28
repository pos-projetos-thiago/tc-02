'use client';

import Image from 'next/image';
import styles from './ServiceCard.module.scss';

export interface ServiceCardProps {
  title: string;
  description?: string;
  icon: string;
  onClick?: () => void;
}

export const ServiceCard = ({ title, description, icon, onClick }: ServiceCardProps) => {
  return (
    <article
      className={styles['service-card']}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles['service-icon']} aria-hidden="true">
        <Image 
          src={icon} 
          alt=""
          width={60}
          height={60}
        />
      </div>
      <div className={styles['service-content']}>
        <h3 className={styles['service-title']}>{title}</h3>
        {description && (
          <p className={styles['service-description']}>{description}</p>
        )}
      </div>
    </article>
  );
};