/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["embla-carousel-autoplay"],
  },
  images: {
    domains: [
      'plasticlettersandsigns.com',
      'www.plasticlettersandsigns.com',
    ],
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
  serverExternalPackages: ['@react-email/components', '@react-email/render', '@react-email/tailwind'],
};

export default nextConfig;
