/*eslint-disable*/
const path = require('path');
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require('next/constants');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withTM = require('next-transpile-modules');

withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const headers = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
    ];
  }
};

module.exports = withPlugins([withBundleAnalyzer, withTM], {
  sassOptions: {
    inCludePaths: [path.join(__dirname, 'styles')]
  },
  poweredByHeader: false,
  webpack5: true,
  images: {
    hostname: ['http://[::1]:5000', process.env.API],
    domains: [
      'bot-thk.vercel.app',
      process.env.API,
      'res.cloudinary.com',
      'localhost',
      '[::1]'
    ],
    deviceSizes: [350, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },
  headers,
  transpileModules: ['antd'],
  pageDataCollectionTimeout: '120',
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      () => import(path.join(__dirname, 'helpers/generate-sitemap'));
    }

    return config;
  },
  swcMinify: true
});
