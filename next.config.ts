import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_REMOTE_HOST } from "./src/constants";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: IMAGE_REMOTE_HOST,
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
