import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = {
  images: {
    domains: ['newsapi.toanthangcar.com'],
  },
};