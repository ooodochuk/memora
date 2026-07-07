export interface CloudLinkDto {
  id: string;
  adventureId: string;
  momentId: string | null;
  providerCode: string;
  title: string;
  url: string;
  notes?: string | null;
}
