import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { serverApiGet } from "@/lib/server-api";
import type {
  PublicAdventureDetailDto,
  PublicPortfolioDto,
} from "./types";

export async function fetchPublicPortfolio(
  username: string,
): Promise<PublicPortfolioDto | null> {
  if (isMockMode()) {
    return null;
  }

  return serverApiGet<PublicPortfolioDto>(
    endpoints.public.profile(username),
  );
}

export async function fetchPublicAdventure(
  username: string,
  slug: string,
): Promise<PublicAdventureDetailDto | null> {
  if (isMockMode()) {
    return null;
  }

  return serverApiGet<PublicAdventureDetailDto>(
    endpoints.public.adventure(username, slug),
  );
}
