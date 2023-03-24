/*eslint-disable*/
/** @type {import('next').NextConfig} */

const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const headers = async () => {
    return [
        {
            source: '/api/:path*',
            headers: [
                { key: 'Access-Control-Allow-Credentials', value: 'true' },
                { key: 'Access-Control-Allow-Origin', value: '*' },
                {
                    key: 'Access-Control-Allow-Methods',
                    value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                },
                {
                    key: 'Access-Control-Allow-Headers',
                    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                },
            ],
        },
    ]
}

module.exports = withBundleAnalyzer({
    compiler: {
    styledComponents: true
  },
    sassOptions: {
        inCludePaths: [path.join(__dirname, 'styles')],
    },
    poweredByHeader: false,
    images: {
        domains: [
            'bot-thk.vercel.app',
            'res.cloudinary.com',
            'localhost',
            '[::1]',
        ],
        // loader:'cloudinary',
        // path:'https://res.cloudinary.com',
        formats: ['image/avif', 'image/webp'],
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [350, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    swcMinify: true,
    headers,
    webpack: (config, { isServer }) => {
        if (isServer) {
            ;() => import(path.join(__dirname, 'helpers/generate-sitemap'))
        }

        return config
    },
})
