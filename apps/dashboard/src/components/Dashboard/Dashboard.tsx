'use client';

import { useState } from 'react';
// import { DashboardHero } from '../DashboardHero/DashboardHero';
import { DashboardNav } from '../DashboardNav';

export const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('services');
  const [balance] = useState(2000);
  const [userName] = useState('Usuário');

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '25rem 1fr',
      gridTemplateRows: 'auto 1fr',
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem'
    }}>
      <aside style={{ gridColumn: '1', gridRow: '1 / -1' }}>
        <DashboardNav 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </aside>
      
      <header style={{ gridColumn: '2', gridRow: '1' }}>
        {/* <DashboardHero
          balance={balance}
          userName={userName}
          activeSection={activeSection}
          user={mockUser}
        /> */}
        <div style={{ padding: '2rem', background: '#f0f0f0', borderRadius: '8px' }}>
          <h1>Olá, {userName}!</h1>
          <p>Saldo: R$ {balance.toFixed(2)}</p>
        </div>
      </header>

      <main style={{ gridColumn: '2', gridRow: '2', padding: '2rem' }}>
        {activeSection === 'investments' && (
          <div>
            <h2>Investimentos</h2>
            <p>Gráficos de investimentos serão carregados aqui</p>
          </div>
        )}
        
        {activeSection === 'services' && (
          <div>
            <h2>Serviços</h2>
            <p>Serviços bancários disponíveis</p>
          </div>
        )}

        {activeSection === 'transfers' && (
          <div>
            <h2>Transferências</h2>
            <p>Área de transferências</p>
          </div>
        )}

        {activeSection === 'cards' && (
          <div>
            <h2>Cartões</h2>
            <p>Gerenciar cartões</p>
          </div>
        )}

        {activeSection === 'others' && (
          <div>
            <h2>Outros Serviços</h2>
            <p>Serviços adicionais</p>
          </div>
        )}
      </main>
    </div>
  );
};