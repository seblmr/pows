/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@resvg/resvg-js',
      ]
    }
    return config
  },
}

module.exports = nextConfig
