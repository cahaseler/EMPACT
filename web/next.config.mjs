/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
};

export default nextConfig;
