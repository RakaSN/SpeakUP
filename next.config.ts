import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dalam Next.js 15+/16+, instrumentationHook diaktifkan secara default tanpa perlu opsi experimental.
  // serverExternalPackages digunakan untuk paket bermasalah seperti bcryptjs di edge/bundler.
  serverExternalPackages: ['bcryptjs'],
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
