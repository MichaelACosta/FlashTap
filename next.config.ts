import type { NextConfig } from "next";

// Set by .github/workflows/deploy.yml — GitHub Pages serves this project
// under /FlashTap, but local dev/build should stay unprefixed (ADR-006).
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPagesBuild ? "/FlashTap" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
