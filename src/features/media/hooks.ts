import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "./api";

export const mediaKeys = {
  all: ["media"] as const,
};

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
  });
}
