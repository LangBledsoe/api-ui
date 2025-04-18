/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js", "ts"],
  env: {
    DKS_API_BASE_URL: process.env["DKS_API_BASE_URL"],
  },
};

export default nextConfig;
