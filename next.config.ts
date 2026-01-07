import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker için standalone output (daha küçük image boyutu)
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "r08r9xcjhu.ufs.sh",
        port: "",
      },
    ],
  },
  // COOP header'ını ayarla (Firebase Auth popup için)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
