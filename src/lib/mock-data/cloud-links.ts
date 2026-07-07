import type { CloudLink } from "@/types";

export const cloudLinks: CloudLink[] = [
 {
 id: "cloud-ch-1",
 tripId: "trip-ch",
 eventId: "event-ch-3-2",
 title: "Lago di Lei — 4K drone orbit (raw)",
 url: "https://drive.google.com/file/d/example-lago-lei-drone/view",
 provider: "GOOGLE_DRIVE",
 contentType: "drone_footage",
 description:
 "12 min of 4K D-log footage around the reservoir. Best light after 17:00.",
 },
 {
 id: "cloud-ch-2",
 tripId: "trip-ch",
 eventId: "event-ch-4-2",
 title: "Albula Pass switchbacks — drone reel",
 url: "https://drive.google.com/file/d/example-albula-drone/view",
 provider: "GOOGLE_DRIVE",
 contentType: "drone_footage",
 description:
 "Top-down and tracking shots of the pass road. Wind was manageable until noon.",
 },
 {
 id: "cloud-ch-3",
 tripId: "trip-ch",
 title: "Switzerland bikepacking — full trip GPX",
 url: "https://drive.google.com/file/d/example-ch-gpx/view",
 provider: "GOOGLE_DRIVE",
 contentType: "gpx",
 description: "680 km loop including hut detours and photo stops.",
 },
 {
 id: "cloud-pt-1",
 tripId: "trip-pt",
 eventId: "event-pt-3-2",
 title: "Ponta da Piedade — coastal drone clips",
 url: "https://icloud.com/share/example-ponta-drone",
 provider: "ICLOUD",
 contentType: "drone_footage",
 description: "Sea stack fly-throughs. Watch for gusts from the west.",
 },
 {
 id: "cloud-pt-2",
 tripId: "trip-pt",
 eventId: "event-pt-2-2",
 title: "Cabo da Roca cliff line — raw video",
 url: "https://www.dropbox.com/s/example-cabo-roca/raw-footage",
 provider: "DROPBOX",
 contentType: "video",
 description: "Ungraded originals — 4K 60fps cliff fly-through.",
 },
 {
 id: "cloud-fo-1",
 tripId: "trip-fo",
 title: "Faroe research — inspiration drone folder",
 url: "https://onedrive.live.com/example-faroe-moodboard",
 provider: "ONEDRIVE",
 contentType: "other",
 description:
 "Reference clips from other pilots, ferry schedules, and weather notes.",
 },
];
