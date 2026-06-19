/**
 * Global, non-translated brand + contact constants. Human-readable copy that
 * needs translation lives in /messages; this file holds stable facts
 * (addresses, URLs, nav keys) referenced across the app and in SEO/schema.
 */
export const siteConfig = {
  name: "Gotch Studio",
  shortName: "Gotch",
  domain: "gotchstudio.com",
  url: "https://gotchstudio.com",
  founded: 2002,
  tagline: "Timeless interiors, thoughtfully made.",
  description:
    "Gotch Studio is an award-winning interior design firm founded in 2002 in Jersey City, New Jersey, creating timeless, wellness-led luxury interiors across all 50 US states and internationally.",
  email: "studio@gotchstudio.com",
  phone: "+1 (201) 555-0142",
  phoneHref: "tel:+12015550142",
  address: {
    street: "110 Hudson Street, Studio 4",
    locality: "Jersey City",
    region: "NJ",
    postalCode: "07302",
    country: "US",
    countryName: "United States",
  },
  geo: { lat: 40.7211, lng: -74.0431 },
  hours: "Mo-Fr 09:00-18:00",
  priceRange: "$$$$",
  social: {
    instagram: "https://instagram.com/gotchstudio",
    pinterest: "https://pinterest.com/gotchstudio",
    linkedin: "https://linkedin.com/company/gotchstudio",
    houzz: "https://houzz.com/pro/gotchstudio",
  },
  // Markets served, surfaced in About / SEO.
  regions: [
    "All 50 US States",
    "Europe",
    "Middle East",
    "Asia",
  ],
} as const;

/** Primary navigation. `key` indexes into messages `nav.*`; `href` is locale-relative. */
export const mainNav = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "journal", href: "/journal" },
  { key: "aiStudio", href: "/ai-studio" },
  { key: "shop", href: "/shop" },
  { key: "contact", href: "/contact" },
] as const;

export const footerNav = {
  studio: [
    { key: "about", href: "/about" },
    { key: "services", href: "/services" },
    { key: "journal", href: "/journal" },
    { key: "contact", href: "/contact" },
  ],
  work: [
    { key: "portfolio", href: "/portfolio" },
    { key: "aiStudio", href: "/ai-studio" },
    { key: "shop", href: "/shop" },
  ],
  legal: [
    { key: "privacy", href: "/legal/privacy" },
    { key: "terms", href: "/legal/terms" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
