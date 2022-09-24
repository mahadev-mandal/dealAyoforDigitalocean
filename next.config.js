/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['pages', 'utils'],
  },
  pwa: {
    dest: "public",
    register: true,
    // disable: process.env.NODE_ENV === 'development',
    skipWaiting: true,
  },
}

module.exports = withPWA(nextConfig);

// Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)


