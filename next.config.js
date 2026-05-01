/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edwinchelliah.com',
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@edwinchelliah.com',
    NEXT_PUBLIC_BASE_PATH: ''
  }
};

module.exports = nextConfig;
