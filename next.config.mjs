/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-email/components', '@react-email/render', '@react-email/tailwind'],
    instrumentationHook: true,
  },
};

export default nextConfig;
