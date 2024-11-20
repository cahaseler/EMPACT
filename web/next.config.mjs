/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { outputFileTracingIgnores: ["./prisma/**/generated/**"] },
};

export default nextConfig;
