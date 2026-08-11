import type { NextConfig } from "next";

// Set by the GitHub Pages workflow (e.g. "/sample-web-posthog"); empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
};

export default nextConfig;
