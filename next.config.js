/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Don't block build on type errors during dev
    // You should still fix them!
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;
