/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@resvg/resvg-js'],
}

module.exports = nextConfig
