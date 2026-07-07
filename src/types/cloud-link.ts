import type { CloudLinkContentType, CloudLinkProvider } from "./enums";

export interface CloudLink {
 id: string;
 tripId: string;
 eventId?: string;
 title: string;
 url: string;
 provider: CloudLinkProvider;
 contentType: CloudLinkContentType;
 description?: string;
}
