import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted on a VPS: emit a minimal standalone server bundle
  // (.next/standalone/server.js) so PM2/systemd can run the app with the
  // smallest possible footprint. See DEPLOYMENT.md.
  output: "standalone",
  // Running a real Node server means the built-in Image Optimization server is
  // available again — keep remote sources allowlisted.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // AI image-generation output (Replicate delivery CDNs).
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "*.replicate.delivery" },
    ],
  },
  reactStrictMode: true,
  // AI routes can stream for a while; allow generous body sizes for uploaded
  // (downscaled) room photos sent as data URLs to the visualizer/staging tools.
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default withNextIntl(nextConfig);
