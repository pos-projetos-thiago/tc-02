'use client';

interface DashboardServicesProps {
  userName: string;
}

export const DashboardServices = ({ userName }: DashboardServicesProps) => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
      minHeight: '300px'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#004D61' }}>
        Serviços
      </h3>
      <p style={{ margin: 0, color: '#666' }}>
        🚧 DashboardServices em desenvolvimento para {userName}
      </p>
    </div>
  );
};