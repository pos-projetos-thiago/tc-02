'use client';

interface UserProfileJWTProps {
  userName: string;
}

export const UserProfileJWT = ({ userName }: UserProfileJWTProps) => {
  return (
    <div style={{
      padding: '1rem 2rem',
      backgroundColor: '#004D61',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>Olá, {userName}! 👋</span>
      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        🚧 Componente em desenvolvimento
      </span>
    </div>
  );
};