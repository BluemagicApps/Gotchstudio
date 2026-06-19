import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/shared/SmartImage";

/** Closing call-to-action band with a cinematic backdrop. */
export function CTA() {
  const t = useTranslations("home.cta");
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80"
          alt="Elegant interior at golden hour"
          fill
          sizes="100vw"
          className="object-cover"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center text-ivory sm:py-40">
        <Reveal>
          <h2 className="display text-ivory">{t("title")}</h2>
          <p className="mx-auto mt-6 max-w-xl text-ivory/80">{t("body")}</p>
          <Button asChild variant="accent" size="lg" className="mt-10">
            <Link href="/contact">
              {t("button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
