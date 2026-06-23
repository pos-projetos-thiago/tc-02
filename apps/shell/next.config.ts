import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    // Module Federation configuration
    config.experiments = { ...config.experiments, topLevelAwait: true }

    // Add webpack configuration for Module Federation
    if (!isServer) {
      const { ModuleFederationPlugin } = require('@module-federation/nextjs-mf')

      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'shell',
          remotes: {
            dashboard: 'dashboard@http://localhost:3001/remoteEntry.js',
            transactions: 'transactions@http://localhost:3002/remoteEntry.js', 
            analytics: 'analytics@http://localhost:3003/remoteEntry.js',
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '19.2.3' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '19.2.3' },
            next: { singleton: true, eager: true, requiredVersion: '16.1.6' },
          },
        })
      )
    }

    return config
  },
  output: 'standalone',
  headers: async () => [
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
  ],
}

export default nextConfig