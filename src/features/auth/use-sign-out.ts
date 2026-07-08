"use client";

import { useRouter } from "@/i18n/navigation";
import { useAppToast } from "@/components/design-system/app-toast";
import { useLogout } from "./hooks";

/** Sign out, clear session/cache, toast, and redirect to home (locale-aware). */
export function useSignOut() {
  const logout = useLogout();
  const router = useRouter();
  const { showToast } = useAppToast();

  async function signOut(toastMessage: string) {
    await logout.mutateAsync();
    showToast(toastMessage);
    router.replace("/");
  }

  return { signOut, isPending: logout.isPending };
}
