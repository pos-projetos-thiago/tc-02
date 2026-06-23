'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BalanceCard } from '../../components/BalanceCard';


function DashboardMicrofrontend() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    // Simula carregamento do microfrontend remoto
    const loadDashboard = async () => {
      try {
        // Simula delay de carregamento remoto
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Pega nome do localStorage se existir
        const token = localStorage.getItem('auth_token');
        if (token) {
          setUserName('Thiago');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.log('Loading dashboard microfrontend...', error);
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column' as const,
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px'
      }}>
        <div style={{ marginBottom: '20px' }}>🔄 Carregando Dashboard Microfrontend...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Conectando com aplicação remota na porta 3001...
        </div>
      </div>
    );
  }

  return (
    <section style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '0'
    }}>
      {/* Hero Section - Similar ao monólito */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '40px 20px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          <div style={{ flex: '1' }}>
            <h1 style={{ 
              color: '#1a1a1a',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}>
              Olá, {userName} :)
            </h1>
            <time style={{ 
              color: '#666',
              fontSize: '16px',
              display: 'block',
              marginBottom: '32px'
            }}>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </time>
            
            <BalanceCard balance={15847.32} />
          </div>
          
          <div style={{ flex: '1', textAlign: 'center' as const }}>
            <div style={{
              width: '300px',
              height: '200px',
              backgroundColor: '#f0f0f0',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '14px',
              margin: '0 auto'
            }}>
              📊 Gráfico do Dashboard<br/>
              (Microfrontend Simulado)
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div style={{ 
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          color: '#1a1a1a',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '32px',
          textAlign: 'center' as const
        }}>
          Serviços Disponíveis
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '32px 24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center' as const,
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <h3 style={{ color: '#1a1a1a', fontSize: '18px', marginBottom: '8px' }}>
              Transações
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              Gerencie suas transações financeiras
            </p>
            <a href="/transactions" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#47A138',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              Acessar
            </a>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '32px 24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center' as const,
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
            <h3 style={{ color: '#1a1a1a', fontSize: '18px', marginBottom: '8px' }}>
              Investimentos
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              Analise seus investimentos
            </p>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Em Breve
            </button>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '32px 24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center' as const,
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
            <h3 style={{ color: '#1a1a1a', fontSize: '18px', marginBottom: '8px' }}>
              Configurações
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              Gerencie seu perfil
            </p>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Configurar
            </button>
          </div>
        </div>
      </div>
      
      {/* Demonstração da Arquitetura */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{ 
          border: '2px dashed #007bff', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3>🎯 Arquitetura de Microfrontends Implementada</h3>
          <p>✅ <strong>Shell (Host):</strong> Porta 3010 - Orquestrador principal</p>
          <p>✅ <strong>Dashboard MF:</strong> Porta 3001 - Módulo de análises financeiras</p>
          <p>✅ <strong>Transactions MF:</strong> Porta 3002 - Módulo de transações</p>
          <p>✅ <strong>Comunicação:</strong> Event Bus entre módulos independentes</p>
          <p>✅ <strong>Deploy Independente:</strong> Cada MF deployado separadamente</p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' as const }}>
        <h2>🔐 Acesso Negado</h2>
        <p>Você precisa estar logado para acessar o dashboard.</p>
        <a href="/" style={{ color: '#007bff' }}>← Voltar para Login</a>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <DashboardMicrofrontend />
      </main>
      <Footer />
    </>
  );
}