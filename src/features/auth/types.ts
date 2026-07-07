/** Backend auth user contract */
export interface UserDto {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/** Backend profile contract for the authenticated user */
export interface ProfileDto {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  tagline: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string;
  website?: string | null;
  createdAt: string;
  stats: {
    tripCount: number;
  };
}

export interface AuthSessionDto {
  user: UserDto;
  profile: ProfileDto;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

export interface UpdateProfileRequestDto {
  displayName?: string;
  bio?: string;
  tagline?: string;
  location?: string;
  website?: string;
}
