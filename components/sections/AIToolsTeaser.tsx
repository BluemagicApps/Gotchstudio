import { useTranslations } from "next-intl";
import { ArrowRight, Wand2, Compass, LayoutGrid } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

export function AIToolsTeaser() {
  const t = useTranslations("home.ai");
  const tools = [
    { icon: Wand2, label: t("tool1") },
    { icon: Compass, label: t("tool2") },
    { icon: LayoutGrid, label: t("tool3") },
  ];

  return (
    <Section className="relative overflow-hidden bg-charcoal text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--brass)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs uppercase tracking-luxe text-brass">
            {t("eyebrow")}
          </p>
          <h2 className="display-sm mt-4 text-ivory">{t("title")}</h2>
          <p className="mt-6 max-w-md text-ivory/75">{t("intro")}</p>
          <Button
            asChild
            variant="accent"
            size="lg"
            className="mt-8"
          >
            <Link href="/ai-studio">
              {t("cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-4">
          {tools.map((tool, i) => (
            <Reveal key={tool.label} delay={i}>
              <div className="flex items-center gap-5 border border-ivory/15 bg-ivory/[0.03] p-6 transition-colors hover:border-brass/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 text-brass">
                  <tool.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="font-serif text-2xl font-light">
                  {tool.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
