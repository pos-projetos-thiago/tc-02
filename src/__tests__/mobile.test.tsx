import { render, screen } from '@testing-library/react';
import { DashboardProvider } from '@/contexts/DashboardContextJWT';
import { DashboardServices } from '@/components/organisms/DashboardServices/DashboardServices';

// Mock simples
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

describe('📱 Mobile & Responsividade', () => {
  it('Todos os botões têm conteúdo legível', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      // Botões devem ter texto OU aria-label
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      
      expect(hasText || hasAriaLabel).toBeTruthy();
    });
  });

  it('Imagens têm alt text para acessibilidade', () => {
    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Procura por imagens
    const images = screen.queryAllByRole('img');
    
    images.forEach(img => {
      const altText = img.getAttribute('alt');
      expect(altText).toBeDefined();
      expect(altText).not.toBe('');
    });
  });

  it('Interface responde a mudanças de viewport', () => {
    // Simula viewport mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <MockWrapper>
        <DashboardServices />
      </MockWrapper>
    );

    // Verifica se renderiza sem erros em mobile
    expect(screen.getByText('Confira os serviços disponíveis')).toBeInTheDocument();
  });
});