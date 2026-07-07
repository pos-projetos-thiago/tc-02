import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Habilitar output standalone para Docker
  output: 'standalone',
  sassOptions: {
    silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
  },
  // Configurar Turbopack para não processar apps
  turbopack: {
    root: '.',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
