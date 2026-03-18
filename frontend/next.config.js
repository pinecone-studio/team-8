const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },
  turbopack: {
    // Allow resolving hoisted deps from the monorepo root.
    root: path.join(__dirname, ".."),
  },
};

module.exports = nextConfig;
