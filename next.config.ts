import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Treat better-sqlite3 as a server-side external so Next.js doesn't try to
  // bundle the native module into the server bundle (it will be require()'d
  // at runtime instead, which is the correct behaviour for native addons).
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
