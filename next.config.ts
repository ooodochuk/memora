import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_REMOTE_HOST } from "./src/constants";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function apiMediaRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }
  | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const candidate = raw
    ? raw.startsWith("http")
      ? raw
      : `https://${raw.replace(/^\/+/, "")}`
    : "http://localhost:8080/api";

  try {
    const url = new URL(candidate);
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      pathname: "/api/media/files/**",
    };
  } catch {
    return null;
  }
}

const apiPattern = apiMediaRemotePattern();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: IMAGE_REMOTE_HOST,
        pathname: "/**",
      },
      ...(apiPattern ? [apiPattern] : []),
    ],
  },
};

export default withNextIntl(nextConfig);
