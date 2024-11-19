/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
  experimental: { esmExternals: false, }
};

export default nextConfig;
