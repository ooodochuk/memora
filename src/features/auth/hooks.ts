import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import {
  fetchCurrentProfile,
  fetchCurrentUser,
  login,
  logout,
  register,
} from "./api";
import type { LoginRequestDto, RegisterRequestDto } from "./types";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export function useCurrentUser() {
  const { isReady, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: fetchCurrentUser,
    enabled: isReady && isAuthenticated,
  });
}

export function useCurrentProfile() {
  const { isReady, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: fetchCurrentProfile,
    enabled: isReady && isAuthenticated,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequestDto) => login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequestDto) => register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
