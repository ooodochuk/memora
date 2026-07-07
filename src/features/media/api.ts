import { apiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiItemResponse } from "@/api/types";
import type { MediaUploadResponseDto } from "./types";

export async function uploadMedia(file: File): Promise<MediaUploadResponseDto> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.upload<ApiItemResponse<MediaUploadResponseDto>>(
    endpoints.media.upload(),
    formData,
  );
  return response.data;
}
