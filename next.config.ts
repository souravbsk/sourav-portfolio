import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Legacy project images uploaded to imgbb by the previous version of this site.
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "*.ibb.co" },
      // Newer imgbb URLs use this host. A leftover `i.ibb.co` allow-list
      // does not cover it, and next/image then 500s the whole page.
      { protocol: "https", hostname: "i.ibb.co.com" },
      { protocol: "https", hostname: "*.ibb.co.com" },
    ],
  },
  serverExternalPackages: ["mongoose", "pdfjs-dist"],
};

export default nextConfig;
