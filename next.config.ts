import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase the body size limit for the registration API to allow
  // high-resolution photo receipts from iPhone/Android (up to 20 MB).
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
