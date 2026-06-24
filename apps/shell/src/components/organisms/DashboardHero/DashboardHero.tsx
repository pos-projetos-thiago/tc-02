'use client';

interface DashboardHeroProps {
  userName: string;
  balance: number;
}

export const DashboardHero = ({ userName, balance }: DashboardHeroProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
      minHeight: '200px'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', color: '#004D61' }}>
        Olá, {userName}! 👋
      </h2>
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#e4ede3',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#47A138' }}>
          Saldo atual
        </p>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#004D61' }}>
          {formatCurrency(balance)}
        </p>
      </div>
      <p style={{ margin: 0, color: '#666' }}>
        🚧 DashboardHero com API conectada - Balance: {formatCurrency(balance)}
      </p>
    </div>
  );
};