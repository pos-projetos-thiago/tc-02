import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../hooks/useJWTAuth'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Bytebank - Microfrontends',
  description: 'Aplicação avançada de gerenciamento financeiro com arquitetura de microfrontends',
  keywords: ['bytebank', 'microfrontends', 'gerenciamento financeiro', 'next.js', 'module federation'],
  authors: [{ name: 'Thiago Soares', url: 'https://github.com/pos-projetos-thiago' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Bytebank - Microfrontends',
    description: 'Aplicação avançada de gerenciamento financeiro com arquitetura de microfrontends',
    type: 'website',
    locale: 'pt_BR',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}