"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useRegister } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/design-system/form-field";
import { formControlClassName } from "@/lib/design-system/form-layout";
import { JournalCard } from "@/components/design-system/journal-card";
import { dashboardRoutes } from "@/constants/routes";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const registerMutation = useRegister();
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const session = await registerMutation.mutateAsync({
        email,
        password,
        displayName,
        username,
      });
      setAuthSession(session.accessToken);
      router.push(dashboardRoutes.home());
    } catch {
      // error shown below
    }
  }

  return (
    <JournalCard padding="lg" className="w-full">
      <h1 className="font-heading mb-6 text-2xl font-medium">{t("registerTitle")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("email")} htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formControlClassName}
            required
          />
        </FormField>
        <FormField label={t("displayName")} htmlFor="displayName">
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={formControlClassName}
            required
          />
        </FormField>
        <FormField label={t("username")} htmlFor="username">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={formControlClassName}
            required
            minLength={3}
            pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"
          />
        </FormField>
        <FormField label={t("password")} htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formControlClassName}
            required
            minLength={8}
          />
        </FormField>
        {registerMutation.isError && (
          <p className="text-sm text-destructive">{t("registerError")}</p>
        )}
        <Button
          type="submit"
          variant="warm"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {t("register")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          {t("goLogin")}
        </Link>
      </p>
    </JournalCard>
  );
}
