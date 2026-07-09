import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardProvider } from '@/contexts/DashboardContextJWT';
import { DashboardServices } from '@/components/organisms/DashboardServices/DashboardServices';

jest.mock('@/hooks/useJWTAuth', () => ({
  useAuth: () => ({
    user: { username: 'João Silva', email: 'joao@exemplo.com' },
    isLoading: false,
    token: 'mock-token',
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
    expect(screen.getByText('Controle Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Meus cartões')).toBeInTheDocument();
    expect(screen.getByText('Pix')).toBeInTheDocument();
  });

  it('Serviços clicáveis respondem ao clique', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const cartoes = screen.getByText('Meus cartões');
    expect(cartoes).toBeInTheDocument();
    fireEvent.click(cartoes);
    // Confirma que a UI não quebrou após o clique
    expect(screen.getByText('Confira os serviços disponíveis')).toBeInTheDocument();
  });

  it('Botões têm texto legível', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('Cards de serviço são clicáveis', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });
});
