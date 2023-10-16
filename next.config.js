/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  customWorkerDir: 'serviceworker'
})
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
