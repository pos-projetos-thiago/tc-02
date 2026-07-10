'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Transaction } from '@/contexts/DashboardContextJWT';
import styles from './InvestmentChart.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const MOBILE_MQ = '(max-width: 719px)';

export interface InvestmentChartProps {
  transactions: Transaction[];
}

const INVESTMENT_COLORS = {
  fundos: '#2567F9',
  'tesouro-direto': '#8F3CFF',
  previdencia: '#FF3C82',
  bolsa: '#F1823D',
} as const;

const INVESTMENT_LABELS = {
  fundos: 'Fundos de investimento',
  'tesouro-direto': 'Tesouro Direto',
  previdencia: 'Previdência Privada',
  bolsa: 'Bolsa de Valores',
} as const;

export const InvestmentChart = ({ transactions }: InvestmentChartProps) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const chartData = useMemo(() => {
    const investmentTransactions = transactions.filter(
      (t) => t.type === 'investment' && t.investmentType
    );

    if (investmentTransactions.length === 0) return null;

    const data = investmentTransactions.reduce(
      (acc, t) => {
        const type = t.investmentType!;
        acc[type] = (acc[type] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const colors = Object.keys(data).map(
      (k) => INVESTMENT_COLORS[k as keyof typeof INVESTMENT_COLORS]
    );

    return {
      labels: Object.keys(data).map((k) => INVESTMENT_LABELS[k as keyof typeof INVESTMENT_LABELS]),
      datasets: [{
        data: Object.values(data),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverOffset: 8,
      }],
    };
  }, [transactions]);

  const options = useMemo(() => {
    const isNarrow = isMobile === true;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isNarrow ? ('bottom' as const) : ('right' as const),
          align: 'center' as const,
          labels: {
            padding: isNarrow ? 12 : 8,
            usePointStyle: true,
            pointStyle: 'circle' as const,
            font: { size: isNarrow ? 11 : 13, family: 'inherit', weight: 'normal' as const },
            color: '#ffffff',
            boxWidth: isNarrow ? 10 : 12,
            boxHeight: isNarrow ? 10 : 12,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: { parsed: number; label: string }) => {
              const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
              return `${context.label}: ${formatted}`;
            },
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold' as const,
          },
          bodyFont: {
            size: 13,
          },
          cornerRadius: 8,
          padding: 12,
        },
      },
      layout: {
        padding: isNarrow
          ? { top: 4, bottom: 4, left: 2, right: 2 }
          : { top: 10, bottom: 10, left: 10, right: 10 },
      },
      cutout: isNarrow ? '58%' : '65%',
      elements: {
        arc: {
          borderRadius: 6,
        },
      },
    };
  }, [isMobile]);

  if (!chartData) {
    return (
      <div className={styles['no-data']}>
        <p>Nenhum investimento encontrado</p>
        <span>Faça sua primeira transação de investimento para ver o gráfico</span>
      </div>
    );
  }

  if (isMobile === undefined) {
    return <div className={styles['chart-placeholder']} aria-hidden />;
  }

  return (
    <div className={styles.chart}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
