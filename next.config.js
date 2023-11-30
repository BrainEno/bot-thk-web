/*eslint-disable*/
/** @type {import('next').NextConfig} */

const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    staticPageGenerationTimeout: 300,
    compiler: {
        styledComponents: true,
    },
    sassOptions: {
        inCludePaths: [path.join(__dirname, 'styles')],
    },
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bot-thk.vercel.app',
            },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { hostname: 'twitter.com' },
            { hostname: 'localhost' },
            { hostname: '[::1]' },
        ],
        formats: ['image/avif', 'image/webp'],
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [350, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    swcMinify: true,
    webpack: (config, { isServer }) => {
        if (isServer) {
            ;() => import(path.join(__dirname, 'helpers/generate-sitemap'))
        }

        config.module.rules.push({
            test: /\.ttf/,
            use: [
                {
                    loader: 'url-loader',
                },
            ],
        })
        return config
    },
})
