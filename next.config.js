// /** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa");

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   eslint: {
//     dirs: ['pages', 'utils'],
//   },
//   pwa: {
//     dest: "public",
//     register: true,
//     // disable: process.env.NODE_ENV === 'development',
//     skipWaiting: true,
//   },
// }

// module.exports = withPWA(nextConfig);

// // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
const withPWA = require("next-pwa");
module.exports = withPWA({
  eslint: {
    dirs: ['pages', 'utils'],
  },
  images: {
    domains: [
      'res.cloudinary.com'
    ],
  },
  pwa: {
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === 'development',
    skipWaiting: true,
  },
});

