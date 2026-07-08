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

function mediaCdnRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }
  | null {
  const raw = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
  if (!raw) return null;

  const candidate = raw.startsWith("http") ? raw : `https://${raw.replace(/^\/+/, "")}`;

  try {
    const url = new URL(candidate);
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const mediaCdnPattern = mediaCdnRemotePattern();

const RAILWAY_MEDIA_HOST = "memora-backend-production-4cff.up.railway.app";

/** Cloudflare R2 public dev URLs (pub-*.r2.dev) — fallback when env is missing at build time */
const R2_PUBLIC_DEV_PATTERN = {
  protocol: "https" as const,
  hostname: "**.r2.dev",
  pathname: "/**",
};

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: IMAGE_REMOTE_HOST,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: RAILWAY_MEDIA_HOST,
        pathname: "/api/media/files/**",
      },
      R2_PUBLIC_DEV_PATTERN,
      ...(apiPattern ? [apiPattern] : []),
      ...(mediaCdnPattern ? [mediaCdnPattern] : []),
    ],
  },
};

export default withNextIntl(nextConfig);
