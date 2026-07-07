import { setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/design-system/page-container";
import { RegisterForm } from "@/components/auth/register-form";
import { GuestAuthRedirect } from "@/components/auth/guest-auth-redirect";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GuestAuthRedirect>
      <PageContainer size="authWide" className="flex min-h-[70vh] items-center py-12">
        <RegisterForm />
      </PageContainer>
    </GuestAuthRedirect>
  );
}
