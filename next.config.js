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
// const withPreact = require('next-plugin-preact');

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
  env: (phase) => {
    // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
    const isDev = phase === PHASE_DEVELOPMENT_SERVER;
    // when `next build` or `npm run build` is used
    const isProd =
      phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
    // when `next build` or `npm run build` is used
    const isStaging =
      phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

    console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);

    const env = {
      API: (() => {
        if (isDev) return process.env.NEXT_PUBLIC_API;
        if (isProd) {
          return process.env.API;
        }
        if (isStaging) return process.env.NEXT_PUBLIC_API;
        return 'API:not (isDev,isProd && !isStaging,isProd && isStaging)';
      })(),
      PUBLIC_URL: (() => {
        if (isDev) return 'http://localhost:3000';
        if (isProd) {
          return 'https://bot-thk.vercel.app';
        }
      })(),
      GA_TRACKING_ID: (() => {
        if (isProd) return process.env.GA_TRACKING_ID;
      })(),
      NEXT_PUBLIC_APP_NAME: 'BOT THK'
    };

    return {
      env
    };
  },
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      () => import(path.join(__dirname, 'helpers/generate-sitemap'));
    }

    // if (!dev) {
    //   Object.assign(config.resolve.alias, {
    //     react: 'preact/compat',
    //     'react-dom/test-utils': 'preact/test-utils',
    //     'react-dom': 'preact/compat'
    //   });
    // }

    // config.module.rules.push({
    //   test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/,
    //   use: [{ loader: 'file-loader' }]
    // });

    return config;
  }
});
