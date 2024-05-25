/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
};

export default nextConfig;
