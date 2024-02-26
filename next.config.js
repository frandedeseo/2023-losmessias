/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['icons.iconarchive.com'],
    },
    experimental: {
        api: {
            externalResolver: true,
        },
    },
};

module.exports = nextConfig;
