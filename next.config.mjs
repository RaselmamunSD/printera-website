/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plasticlettersandsigns.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.plasticlettersandsigns.com',
        pathname: '/**',
      },
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
  serverExternalPackages: [
    'embla-carousel-autoplay',
    '@react-email/components',
    '@react-email/render',
    '@react-email/tailwind',
  ],
};

export default nextConfig;
