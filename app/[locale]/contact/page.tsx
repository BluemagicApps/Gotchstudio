import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { MapPin, Mail, Phone, Clock, Globe } from "lucide-react";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { BookingWidget } from "@/components/contact/BookingWidget";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("contact");
  const info = [
    {
      icon: MapPin,
      label: t("info.studio"),
      value: `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`,
    },
    { icon: Mail, label: t("info.email"), value: siteConfig.email },
    { icon: Phone, label: t("info.phone"), value: siteConfig.phone },
    { icon: Clock, label: t("info.hours"), value: t("info.hoursValue") },
    { icon: Globe, label: t("info.global"), value: t("info.globalValue") },
  ];

  // Static Google Maps embed centered on the Jersey City HQ.
  const mapSrc = `https://www.google.com/maps?q=${siteConfig.geo.lat},${siteConfig.geo.lng}&z=14&output=embed`;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        intro={t("hero.intro")}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <ContactForm />
          </div>
          <aside className="space-y-8">
            <ul className="space-y-6">
              {info.map((row) => (
                <li key={row.label} className="flex gap-4">
                  <row.icon
                    className="mt-1 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="eyebrow mb-1">{row.label}</p>
                    <p className="text-sm text-muted-foreground">{row.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="overflow-hidden rounded-lg border border-border">
              <iframe
                title="Gotch Studio location"
                src={mapSrc}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-card" size="narrow">
        <BookingWidget />
      </Section>
    </>
  );
}
