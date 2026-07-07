import type { Profile } from "@/types";

export const profiles: Profile[] = [
 {
 id: "profile-oksana",
 userId: "user-oksana",
 username: "oksana",
 displayName: "Oksana Odocuk",
 bio: "Bikepacker, hiker, and drone pilot. I travel slowly — for ridges, refuges, and the light between storms.",
 tagline: "",
 avatarUrl:
 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
 coverUrl:
 "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop",
 location: "Kyiv, Ukraine",
 website: "https://memora.travel",
 createdAt: "2024-03-15T10:00:00Z",
 stats: {
 tripCount: 4,
 },
 isOwnProfile: true,
 },
];

export const currentProfile = profiles[0];
