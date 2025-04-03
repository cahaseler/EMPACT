/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    nodeMiddleware: true,
  },
  typescript: {
   // Explicitly point to the tsconfig within this workspace
   // to potentially fix path resolution issues during build-time type check.
   tsconfigPath: './tsconfig.json',
  }
}

export default nextConfig
