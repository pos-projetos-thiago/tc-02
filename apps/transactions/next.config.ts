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

    if (!isServer) {
      const { ModuleFederationPlugin } = require('@module-federation/nextjs-mf')

      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'transactions',
          filename: 'remoteEntry.js',
          exposes: {
            './Transactions': './src/components/Transactions',
            './FilterBar': './src/components/FilterBar',
            './Pagination': './src/components/Pagination',
            './TransactionItem': './src/components/TransactionItem',
            './TransactionOCR': './src/components/TransactionOCR',
            './DashboardExtract': './src/components/DashboardExtract',
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
}

export default nextConfig