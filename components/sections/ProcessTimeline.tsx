import { useTranslations } from "next-intl";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "./SectionHeading";
import { processSteps } from "@/data/services";

export function ProcessTimeline() {
  const t = useTranslations("services.process");
  return (
    <Section className="bg-card">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        align="center"
      />
      <div className="mx-auto mt-16 max-w-3xl">
        {processSteps.map((step, i) => (
          <Reveal key={step.number} delay={i % 3}>
            <div className="flex gap-6 border-t border-border py-8 sm:gap-10">
              <span className="font-serif text-3xl font-light text-accent sm:text-4xl">
                {step.number}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-light">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
