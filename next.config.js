/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Disable SWC minify for better compatibility
  swcMinify: false,
}

module.exports = nextConfig 