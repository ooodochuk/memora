export interface ProfileStats {
 tripCount: number;
}

export interface Profile {
 id: string;
 userId: string;
 username: string;
 displayName: string;
 bio: string;
 tagline: string;
 avatarUrl: string;
 coverUrl: string;
 location: string;
 website?: string;
 createdAt: string;
 stats: ProfileStats;
 /** Client-only flag for demo UI */
 isOwnProfile?: boolean;
}
