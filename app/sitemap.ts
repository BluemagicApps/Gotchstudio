import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/routing";
import { projects } from "@/data/projects";
import { journal } from "@/data/journal";

// Required for `output: export`.
export const dynamic = "force-static";

const staticPaths = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/journal",
  "/ai-studio",
  "/shop",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const p of projects) {
      entries.push({
        url: `${siteConfig.url}/${locale}/portfolio/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
    for (const post of journal) {
      entries.push({
        url: `${siteConfig.url}/${locale}/journal/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
