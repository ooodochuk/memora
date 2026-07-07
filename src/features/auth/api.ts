import { apiClient } from "@/api/client";
import { isMockMode } from "@/api/config";
import { endpoints } from "@/api/endpoints";
import { mockDelay } from "@/api/mock-delay";
import type { ApiItemResponse } from "@/api/types";
import {
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/mock-data";
import { applyAuthSession } from "@/lib/auth-session";
import type {
  ProfileDto,
  UserDto,
  AuthSessionDto,
  LoginRequestDto,
  RegisterRequestDto,
} from "./types";

interface MeResponseDto {
  user: UserDto;
  profile: ProfileDto;
}

function toUserDto(user: ReturnType<typeof getCurrentUser>): UserDto {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toProfileDto(profile: ReturnType<typeof getCurrentProfile>): ProfileDto {
  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    tagline: profile.tagline ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    coverUrl: profile.coverUrl ?? "",
    location: profile.location,
    website: profile.website,
    createdAt: profile.createdAt,
    stats: profile.stats,
  };
}

async function fetchMe(): Promise<MeResponseDto> {
  const response = await apiClient.get<ApiItemResponse<MeResponseDto>>(
    endpoints.auth.me(),
  );
  return response.data;
}

export async function fetchCurrentUser(): Promise<UserDto> {
  if (isMockMode()) {
    await mockDelay();
    return toUserDto(getCurrentUser());
  }
  const me = await fetchMe();
  return me.user;
}

export async function fetchCurrentProfile(): Promise<ProfileDto> {
  if (isMockMode()) {
    await mockDelay();
    return toProfileDto(getCurrentProfile());
  }
  const me = await fetchMe();
  return me.profile;
}

export async function register(
  payload: RegisterRequestDto,
): Promise<AuthSessionDto> {
  if (isMockMode()) {
    await mockDelay();
    const session = {
      user: toUserDto(getCurrentUser()),
      profile: toProfileDto(getCurrentProfile()),
      accessToken: "mock-access-token",
    };
    applyAuthSession(session.accessToken);
    return session;
  }

  const response = await apiClient.post<ApiItemResponse<AuthSessionDto>>(
    endpoints.auth.register(),
    payload,
  );
  const session = response.data;
  applyAuthSession(session.accessToken);
  return session;
}

export async function login(credentials: LoginRequestDto): Promise<AuthSessionDto> {
  if (isMockMode()) {
    await mockDelay();
    const session = {
      user: toUserDto(getCurrentUser()),
      profile: toProfileDto(getCurrentProfile()),
      accessToken: "mock-access-token",
    };
    applyAuthSession(session.accessToken);
    return session;
  }

  const response = await apiClient.post<ApiItemResponse<AuthSessionDto>>(
    endpoints.auth.login(),
    credentials,
  );
  const session = response.data;
  applyAuthSession(session.accessToken);
  return session;
}

export async function logout(): Promise<void> {
  if (isMockMode()) {
    await mockDelay();
  }
  applyAuthSession(null);
}
