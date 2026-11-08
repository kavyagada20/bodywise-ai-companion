/** @type {import('next').NextConfig} */
const backendDestination = process.env.NODE_ENV === 'production'
  ? 'https://bodywise-backend-xoyc.onrender.com/api/:path*'
  : 'http://127.0.0.1:8000/api/:path*';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: backendDestination,
      },
    ];
  },
};

module.exports = nextConfig;

