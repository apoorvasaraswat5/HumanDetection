/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'i.imgur.com',
              port: '',
            }],
    },
    reactStrictMode: false,
}

module.exports = nextConfig
