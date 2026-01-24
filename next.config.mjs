import { default as withPWA } from '@ducanh2912/next-pwa';
/** @type {import('next').NextConfig} */

const pwaConfig = withPWA({
  dest: 'public', // Output directory for service worker files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate new service worker immediately
});
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

// Merge PWA config into nextConfig
mergeConfig(nextConfig, pwaConfig);

function mergeConfig(nextConfig, additionalConfig) {
  if (!additionalConfig) {
    return;
  }

  for (const key in additionalConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key]) &&
      additionalConfig[key] !== null &&
      typeof additionalConfig[key] === 'object'
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...additionalConfig[key],
      };
    } else {
      nextConfig[key] = additionalConfig[key];
    }
  }
}

export default nextConfig;
