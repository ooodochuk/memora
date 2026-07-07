import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/hooks";
import type { ProfileDto, UpdateProfileRequestDto } from "@/features/auth/types";
import { updateProfile } from "./api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequestDto) => updateProfile(payload),
    onSuccess: (profile: ProfileDto) => {
      queryClient.setQueryData(authKeys.profile(), profile);
    },
  });
}
