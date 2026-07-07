"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogin } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/design-system/form-field";
import { formControlClassName } from "@/lib/design-system/form-layout";
import { JournalCard } from "@/components/design-system/journal-card";
import { dashboardRoutes } from "@/constants/routes";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const loginMutation = useLogin();
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const session = await loginMutation.mutateAsync({ email, password });
      setAuthSession(session.accessToken);
      router.push(dashboardRoutes.home());
    } catch {
      // error shown below
    }
  }

  return (
    <JournalCard padding="lg" className="w-full">
      <h1 className="font-heading mb-6 text-2xl font-medium">{t("loginTitle")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("email")} htmlFor="email">
          <Input
            id="email"
            type="email"
            className={formControlClassName}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
        <FormField label={t("password")} htmlFor="password">
          <Input
            id="password"
            type="password"
            className={formControlClassName}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </FormField>
        {loginMutation.isError && (
          <p className="text-sm text-destructive">{t("loginError")}</p>
        )}
        <Button
          type="submit"
          variant="warm"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {t("login")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
          {t("goRegister")}
        </Link>
      </p>
    </JournalCard>
  );
}
