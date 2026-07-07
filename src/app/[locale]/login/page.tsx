import { setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/design-system/page-container";
import { LoginForm } from "@/components/auth/login-form";
import { GuestAuthRedirect } from "@/components/auth/guest-auth-redirect";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GuestAuthRedirect>
      <PageContainer className="flex min-h-[70vh] items-center py-12">
        <LoginForm />
      </PageContainer>
    </GuestAuthRedirect>
  );
}
