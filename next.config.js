/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['flagcdn.com'],
  },
}

module.exports = nextConfig
