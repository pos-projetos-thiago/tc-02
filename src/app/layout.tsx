import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Bytebank - Gerenciamento Financeiro',
  description: 'Plataforma moderna de gerenciamento financeiro com controle de saldo, transferências e investimentos. Desenvolvida por Thiago Soares para o Tech Challenge FIAP.',
  keywords: ['gerenciamento financeiro', 'banking', 'transferências', 'investimentos', 'fiap', 'tech challenge'],
  authors: [{ name: 'Thiago Soares' }],
  creator: 'Thiago Soares',
  robots: 'index, follow',
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
