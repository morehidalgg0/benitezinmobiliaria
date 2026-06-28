/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
