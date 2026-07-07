/** Uploaded media file metadata from POST /media/upload */
export interface MediaUploadResponseDto {
  url: string;
  fileName: string;
  contentType: string;
  size: number;
}

/** Backend cloud link on a moment */
export interface CloudLinkDto {
  id: string;
  adventureId: string;
  momentId?: string;
  providerCode: string;
  title: string;
  url: string;
  notes?: string;
}
