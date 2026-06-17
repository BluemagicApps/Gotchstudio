import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { localBusinessJsonLd } from "@/lib/seo";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { VariantProvider } from "@/components/providers/VariantProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LocaleDetector } from "@/components/providers/LocaleDetector";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/ai/Chatbot";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Timeless Interior Design`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: { icon: "/favicon.svg" },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#171513" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();

  // Enable static rendering for this locale.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Fonts loaded via link to keep the static build network-independent. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <VariantProvider>
              <LenisProvider>
                <LocaleDetector current={locale as Locale} />
                <a
                  href="#main"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
                >
                  Skip to content
                </a>
                <Header />
                <main id="main">{children}</main>
                <Footer />
                <Chatbot />
              </LenisProvider>
            </VariantProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
