/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Configuration des alias de chemin pour résoudre les imports @/*
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Configuration étendue pour gérer les modules Node.js côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        path: false,
        os: false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
      };
      
      // Exclure les packages problématiques côté client
      config.externals = config.externals || [];
      config.externals.push({
        '@nodelib/fs.scandir': 'commonjs @nodelib/fs.scandir',
        '@nodelib/fs.stat': 'commonjs @nodelib/fs.stat',
        '@nodelib/fs.walk': 'commonjs @nodelib/fs.walk',
      });
    }

    return config;
  },
  reactStrictMode: true,
  // Ignorer ESLint pendant le build pour déployer plus rapidement
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorer TypeScript errors pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuration pour puppeteer-core et Vercel
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min'],
  // Suppression des propriétés obsolètes/non reconnues
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        // Apply these headers to API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 