/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  customWorkerDir: 'serviceworker'
})
const nextConfig = {
  reactStrictMode: false,
  images: { domains: ['cdn.shopify.com'], formats: ['image/avif', 'image/webp'], }

}

module.exports = withPWA(nextConfig)
