import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/wedding",
        destination: "/templates",
        permanent: true,
      },
      {
        source: "/wedding/:path*",
        destination: "/templates",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
