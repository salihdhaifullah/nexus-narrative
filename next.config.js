/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['flagcdn.com', 'gogounoxmghllxekidkz.supabase.co'],
  },
}

module.exports = nextConfig;
