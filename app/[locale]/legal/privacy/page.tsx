import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { siteConfig } from "@/config/site";
import { LegalBody } from "@/components/shared/LegalBody";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return buildMetadata({
    locale,
    path: "/legal/privacy",
    title: t("title"),
    description: `${siteConfig.name} privacy policy.`,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("legal.privacy");
  return (
    <Container size="narrow" className="py-36 sm:py-44">
      <h1 className="display-sm">{t("title")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t("updated")}</p>
      <LegalBody
        sections={[
          {
            h: "Overview",
            p: `${siteConfig.name} ("we," "us") respects your privacy. This policy explains what information we collect, how we use it, and your rights regarding it.`,
          },
          {
            h: "Information we collect",
            p: "We collect information you provide directly — such as your name, email, phone, and project details when you submit an inquiry or subscribe to our newsletter. We also collect limited, anonymized analytics and approximate location (via IP) to present the site in your preferred language.",
          },
          {
            h: "How we use information",
            p: "We use your information to respond to inquiries, deliver our services, send communications you have requested, and improve our website. We do not sell your personal information.",
          },
          {
            h: "Cookies & local storage",
            p: "We use local storage and cookies to remember your language and appearance preferences. These are essential to providing a seamless experience and are not used for advertising.",
          },
          {
            h: "Data retention & security",
            p: "We retain personal information only as long as necessary to fulfill the purposes described here, and we apply reasonable safeguards to protect it.",
          },
          {
            h: "Your rights",
            p: "You may request access to, correction of, or deletion of your personal information at any time by contacting us at the address below.",
          },
          {
            h: "Contact",
            p: `Questions about this policy? Email us at ${siteConfig.email}.`,
          },
        ]}
      />
    </Container>
  );
}
