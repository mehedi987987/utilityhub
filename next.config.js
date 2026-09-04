/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Compress output
  compress: true,
  // Optimize production builds
  poweredByHeader: false,
  // Generate ETags for better caching
  generateEtags: true,
}

module.exports = nextConfig
