import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be uploaded directly to cPanel / shared hosting.
  output: "export",
  // Static export cannot use the on-demand Image Optimization server.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  // Emit /about/index.html style folders so links work on static hosts.
  trailingSlash: true,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
