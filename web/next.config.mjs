/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: { outputFileTracingIgnores: ["./prisma/**/generated/**"] },
};

export default nextConfig;
