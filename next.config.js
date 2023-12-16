/*eslint-disable*/
/** @type {import('next').NextConfig} */

const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})


const { i18n } = require('./next-i18next.config')

const nextConfig = withBundleAnalyzer({
    staticPageGenerationTimeout: 300,
    compiler: {
        styledComponents: true,
    },
    sassOptions: {
        inCludePaths: [path.join(__dirname, 'styles')],
    },
    poweredByHeader: false,
    i18n,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bot-thk.vercel.app',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/**`
            },
            { hostname: 'twitter.com' },
            { hostname: 'localhost' },
            { hostname: '[::1]' },
        ],
        formats: ['image/avif', 'image/webp'],
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [350, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        minimumCacheTTL: 60
    },
    swcMinify: true,
    webpack: (config, { isServer }) => {
        if (isServer) {
            ; () => import(path.join(__dirname, 'helpers/generate-sitemap'))
        }

        return config
    },
})

module.exports = nextConfig