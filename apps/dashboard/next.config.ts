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
          name: 'dashboard',
          filename: 'remoteEntry.js',
          exposes: {
            './Dashboard': './src/components/Dashboard',
            './DashboardHero': './src/components/DashboardHero',
            './DashboardNav': './src/components/DashboardNav',
            './BalanceCard': './src/components/BalanceCard',
            './InvestmentChart': './src/components/InvestmentChart',
            './DashboardServices': './src/components/DashboardServices',
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