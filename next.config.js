/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['flagcdn.com', 'poousylnpfiblvwjmsge.supabase.co'],
  },
}

module.exports = nextConfig
