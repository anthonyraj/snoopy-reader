import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "sqlite-vec", "sqlite-vec-darwin-arm64"],
};

export default nextConfig;
