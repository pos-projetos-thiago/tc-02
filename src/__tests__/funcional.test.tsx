import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { DashboardServices } from '@/components/organisms/DashboardServices/DashboardServices';

// Mock simples
jest.mock('@/hooks/useSupabaseAuth', () => ({
  useSupabaseAuth: () => ({
    user: { user_metadata: { full_name: 'João Silva' } },
    loading: false,
    signOut: jest.fn(),
  }),
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <DashboardProvider>{children}</DashboardProvider>
);

describe('🧪 Funcionalidade Básica', () => {
  it('Dashboard carrega e exibe serviços', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    expect(screen.getByText('Confira os serviços disponíveis')).toBeInTheDocument();
    expect(screen.getByText('Empréstimo')).toBeInTheDocument();
    expect(screen.getByText('Meus cartões')).toBeInTheDocument();
    expect(screen.getByText('Pix')).toBeInTheDocument();
  });

  it('Navegação para "Meus cartões" funciona', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Clica em "Meus cartões"
    fireEvent.click(screen.getByText('Meus cartões'));
    
    // Verifica mudança de conteúdo
    expect(screen.getByText('Cartão digital')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument(); // Nome do usuário
    expect(screen.getByRole('button', { name: 'Configurar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bloquear' })).toBeInTheDocument();
  });

  it('Botões têm texto legível', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Navega para cartões
    fireEvent.click(screen.getByText('Meus cartões'));
    
    const configurarBtn = screen.getByRole('button', { name: 'Configurar' });
    const bloquearBtn = screen.getByRole('button', { name: 'Bloquear' });
    
    // Botões devem ter texto visível
    expect(configurarBtn).toHaveTextContent('Configurar');
    expect(bloquearBtn).toHaveTextContent('Bloquear');
  });

  it('Cards de serviço são clicáveis', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const buttons = screen.getAllByRole('button');
    
    // Verifica se todos os botões existem e são interativos
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });
});