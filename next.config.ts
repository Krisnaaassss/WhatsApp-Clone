import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {hostname: "charming-lobster-709.convex.cloud"}
    ]
  }
};

export default nextConfig;
