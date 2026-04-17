import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { DashboardServices } from '@/components/organisms/DashboardServices/DashboardServices';

// Mock do hook de autenticação
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

describe('Dashboard', () => {
  it('exibe serviços disponíveis por padrão', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    expect(screen.getByText('Confira os serviços disponíveis')).toBeInTheDocument();
    expect(screen.getByText('Empréstimo')).toBeInTheDocument();
    expect(screen.getByText('Meus cartões')).toBeInTheDocument();
  });

  it('navega para seção "Meus cartões"', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Clica em "Meus cartões"
    fireEvent.click(screen.getByText('Meus cartões'));
    
    // Verifica se mudou para a seção de cartões
    expect(screen.getByText('Cartão digital')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('exibe botões de ação na seção cartões', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Navega para cartões
    fireEvent.click(screen.getByText('Meus cartões'));
    
    // Verifica botões de ação
    expect(screen.getByRole('button', { name: 'Configurar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bloquear' })).toBeInTheDocument();
    expect(screen.getByText('Função: Débito/Crédito')).toBeInTheDocument();
  });
});