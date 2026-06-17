import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { locales, type Locale } from "@/i18n/routing";

/** Build hreflang alternates for a given path (without locale prefix). */
function languageAlternates(path: string) {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteConfig.url}/${l}${clean}`;
  }
  return languages;
}

/**
 * Compose page metadata with sensible luxury defaults, canonical + hreflang.
 * `path` is the locale-relative route (e.g. "/about").
 */
export function buildMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const { locale, path, title, description } = opts;
  const image = opts.image ?? `${siteConfig.url}/og/default.jpg`;
  const url = `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** schema.org LocalBusiness / InteriorDesignFirm JSON-LD. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: String(siteConfig.founded),
    priceRange: siteConfig.priceRange,
    image: `${siteConfig.url}/og/default.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    openingHours: siteConfig.hours,
    areaServed: siteConfig.regions,
    sameAs: Object.values(siteConfig.social),
  };
}

/** schema.org CreativeWork for a portfolio project. */
export function projectJsonLd(p: {
  title: string;
  description: string;
  slug: string;
  image: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    url: `${siteConfig.url}/${p.locale}/portfolio/${p.slug}`,
    image: p.image,
    creator: { "@type": "Organization", name: siteConfig.name },
  };
}
