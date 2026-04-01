import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redefinir Senha - Bytebank',
  description: 'Redefina sua senha de acesso ao Bytebank de forma segura',
  robots: 'noindex, nofollow',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}