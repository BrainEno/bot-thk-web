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
        domains: [
            'bot-thk.vercel.app',
            'res.cloudinary.com',
            'twitter.com',
            'localhost',
            '[::1]',
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


        return config
    },
})
