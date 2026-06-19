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
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return buildMetadata({
    locale,
    path: "/legal/terms",
    title: t("title"),
    description: `${siteConfig.name} terms of service.`,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("legal.terms");
  return (
    <Container size="narrow" className="py-36 sm:py-44">
      <h1 className="display-sm">{t("title")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t("updated")}</p>
      <LegalBody
        sections={[
          {
            h: "Acceptance of terms",
            p: `By accessing ${siteConfig.domain}, you agree to these terms. If you do not agree, please discontinue use of the site.`,
          },
          {
            h: "Use of the site",
            p: "You may use this site for lawful, personal, and non-commercial purposes. You agree not to misuse the site, attempt to disrupt it, or access it through automated means without permission.",
          },
          {
            h: "Intellectual property",
            p: `All content on this site — including photography, text, designs, and branding — is the property of ${siteConfig.name} or its licensors and may not be reproduced without written permission.`,
          },
          {
            h: "Project imagery",
            p: "Imagery shown may include representative or placeholder photography for demonstration purposes. Final project rights and credits are governed by individual client agreements.",
          },
          {
            h: "AI tools",
            p: "The AI Studio tools are provided for inspiration and demonstration. Generated previews are illustrative and do not constitute a design proposal or guarantee of outcome.",
          },
          {
            h: "Limitation of liability",
            p: "The site is provided 'as is.' To the fullest extent permitted by law, we disclaim liability for any damages arising from your use of the site.",
          },
          {
            h: "Contact",
            p: `Questions about these terms? Email us at ${siteConfig.email}.`,
          },
        ]}
      />
    </Container>
  );
}
