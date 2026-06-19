# Gotch Studio

A production-grade, hyper-polished marketing website for **Gotch Studio** — an
award-winning interior design firm (founded 2002, Jersey City, NJ; projects
across all 50 US states and internationally).

Domain: **gotchstudio.com**

Timeless modern luxury: deep charcoals, warm taupes, soft ivories, rich woods,
and brass accents — fully responsive, light/dark, multilingual, AI-enhanced, and
deployable to cPanel as a static export.

---

## Tech stack

- **Next.js 15** (App Router) with `output: 'export'` — static HTML for any host.
- **TypeScript**, **Tailwind CSS**, **shadcn/ui** (Radix) + custom components.
- **Framer Motion** animations, **Lenis** smooth scroll.
- **next-intl** i18n (8 locales, English-authored with deep fallback).
- **next-themes** light/dark.
- **Prisma + SQLite** schema (documented upgrade path) + optional Express API.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /en)
npm run build      # static export → ./out
npm run serve      # preview the export
npm run typecheck  # tsc --noEmit
npm run lint
```

## Project structure

```
app/[locale]/         Localized pages (home, about, services, portfolio,
                      portfolio/[slug], journal, journal/[slug], ai-studio,
                      shop, contact, legal/privacy, legal/terms)
app/sitemap.ts        Multi-locale sitemap (+ project/journal slugs)
app/robots.ts         robots.txt
components/
  layout/             Header, Footer, MobileNav, Theme/Language/Variant switchers
  sections/           Home + page sections (Hero, AboutIntro, ServicesGrid, …)
  project/            ProjectCard, PortfolioGrid (filter/search), BeforeAfterSlider
  ai/                 RoomVisualizer, StyleQuiz (+moodboard), Chatbot, styleData
  shop/               ShopGrid
  contact/            ContactForm, BookingWidget
  providers/          Theme, Variant, Lenis, LocaleDetector
  shared/             Container, Section, Reveal, SmartImage, Marquee, Newsletter…
  ui/                 shadcn primitives (button, dropdown-menu, tabs)
config/
  site.ts             Brand facts, nav, contact, social
  variants.ts         The 5 aesthetic variants (palettes, fonts, hero/nav styles)
data/                 Typed content: projects, journal, team, services, …
i18n/                 routing.ts (locales) + request.ts (deep-merge fallback)
lib/                  utils, seo (metadata + JSON-LD), geo (ipapi detection)
messages/             en.json (complete) + de/es/pt/fr/zh/ja/nl.json (partial)
prisma/schema.prisma  Data model for the upgrade path
server/               Optional Express API (inquiries, newsletter, bookings)
public/               index.html (root locale redirect), favicon, manifest, .htaccess
```

## The 5 aesthetic variants

A single themeable codebase ships all five looks. Switch live via the **palette
icon** in the header (persists to `localStorage`); the default is *Timeless
Editorial*, which is the fully-polished direction.

| # | Variant | Feel | Hero / Accent |
|---|---------|------|----------------|
| 1 | **Timeless Editorial** | Clean, narrative, European calm | Full-bleed video · brass |
| 2 | **Bold Modern Atelier** | Architectural, product-forward | Split grid · navy |
| 3 | **Warm Sanctuary** | Wellness, soft layers | Layered · emerald |
| 4 | **Global Eclectic** | Collected, well-travelled | Mosaic · emerald |
| 5 | **Minimal Maximalist** | White space + statement image | Statement · brass |

Each variant defines a full light + dark token set in `config/variants.ts`;
`VariantProvider` writes them onto `<html>` as CSS custom properties at runtime.

## Internationalization

- Locales: `en` (default, fully authored), `de`, `es`, `pt`, `fr`, `zh`, `ja`, `nl`.
- Every page is statically pre-rendered per locale (`generateStaticParams`).
- On first visit, `lib/geo.ts` detects country via **ipapi.co** and routes to the
  matching locale (stored thereafter; manual switch always wins). The bare-domain
  `public/index.html` does the same at the very root.
- Missing keys **deep-merge onto English** (`i18n/request.ts`) — no raw keys, no
  flicker. Replace the partial locale files with professional translations before
  launch.

## AI features (client-side demos)

- **Room Visualizer** — upload → pick a signature style → curated "after" preview.
- **Style Quiz** — short quiz → style profile → shareable moodboard.
- **Design Concierge** — floating chatbot with scripted answers.

All are clearly labeled demos with documented seams to connect Replicate /
Hugging Face / Spacely (visualizer) and the Claude API (chatbot). See inline
`TODO` comments and `.env.example`.

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for cPanel (static), the optional Node
API, and a PHP form fallback.

## Notes on assets

All imagery uses curated **Unsplash** placeholders for demonstration. Replace
with licensed or commissioned, optimized photography before launch for the best
Lighthouse scores and brand fidelity.
