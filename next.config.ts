import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "product.hstatic.net", pathname: "/**" },
      { protocol: "https", hostname: "cdn.hstatic.net", pathname: "/**" },
      { protocol: "https", hostname: "*.hstatic.net", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "oaidalleapiprodscus.blob.core.windows.net", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
