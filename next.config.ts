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
};

export default nextConfig;
