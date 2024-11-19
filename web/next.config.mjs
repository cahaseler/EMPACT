/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
  experimental: { esmExternals: false, }
};

export default nextConfig;
