import { Container } from "./Container";
import { Reveal } from "./Reveal";

/** Consistent inner-page hero with generous top spacing under the fixed header. */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-border pb-16 pt-36 sm:pb-20 sm:pt-44">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="display">{title}</h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {intro}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
