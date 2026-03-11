const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Allow resolving hoisted deps from the monorepo root.
    root: path.join(__dirname, ".."),
  },
};

module.exports = nextConfig;
