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
  // COOP header'ını ayarla (sadece HTTPS veya localhost için)
  // HTTP'de COOP header'ı güvenilir olmayan origin'lerde çalışmaz
  async headers() {
    // Production'da ve HTTPS kullanıyorsak COOP header'ı ekle
    // HTTP kullanıyorsanız bu header'ı kaldırın
    if (process.env.USE_HTTPS === "true") {
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
    }
    return [];
  },
};

export default nextConfig;
