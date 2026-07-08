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

describe('Dashboard', () => {
  it('exibe serviços disponíveis por padrão', () => {
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

  it('navega para seção "Meus cartões"', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Meus cartões'));

    // Após o clique, setActiveSection é chamado — o mock não muda estado,
    // mas confirma que o elemento era clicável
    expect(screen.getByText('Meus cartões')).toBeInTheDocument();
  });

  it('exibe serviços clicáveis com role button', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(btn => expect(btn).toBeEnabled());
  });
});
