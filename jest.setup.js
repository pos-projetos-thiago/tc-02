import '@testing-library/jest-dom';

// Mock do fetch global — não disponível no jsdom/Node.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock do Next.js App Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do DashboardContextJWT para evitar chamadas reais à API
jest.mock('@/contexts/DashboardContextJWT', () => ({
  DashboardProvider: ({ children }) => children,
  useDashboard: () => ({
    activeSection: 'services',
    setActiveSection: jest.fn(),
    balance: 1000,
    transactions: [],
    addTransaction: jest.fn(),
    editTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    isLoading: false,
  }),
}));
