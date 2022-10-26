/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['source.unsplash.com', 'nvyulqjjulqfqxirwtdq.supabase.co'],
  },
}

module.exports = nextConfig
