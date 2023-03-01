/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['flagcdn.com', 'afpvklxswartvhfhdnhe.supabase.co'],
  },
}

module.exports = nextConfig;
