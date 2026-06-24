'use client';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment';
  amount: number;
  description: string;
  date: string;
}

interface DashboardExtractProps {
  transactions: Transaction[];
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const DashboardExtract = ({ transactions, onEditClick, onDeleteClick }: DashboardExtractProps) => {
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
      minHeight: '400px'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#004D61' }}>
        Extrato
      </h3>
      
      {transactions.length > 0 ? (
        <div>
          <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
            {transactions.length} transação(ões) encontrada(s)
          </p>
          {transactions.slice(0, 4).map((transaction) => (
            <div 
              key={transaction.id}
              style={{
                padding: '0.8rem',
                border: '1px solid #dee9ea',
                borderRadius: '6px',
                marginBottom: '0.8rem',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>{transaction.description}</span>
                <span style={{ 
                  color: transaction.type === 'deposit' ? '#47A138' : '#BF1313',
                  fontWeight: '600' 
                }}>
                  {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                {transaction.type} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={onEditClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#004D61',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Editar
            </button>
            <button 
              onClick={onDeleteClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#BF1313',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: '#666' }}>Nenhuma transação encontrada</p>
      )}
      
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.8rem' }}>
        🚧 DashboardExtract com {transactions.length} transações da API
      </p>
    </div>
  );
};