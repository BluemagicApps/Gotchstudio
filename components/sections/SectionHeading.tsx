import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

/** Shared editorial section heading (eyebrow + title + optional intro). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="display-sm">{title}</h2>
      {intro && (
        <p className="mt-5 text-base text-muted-foreground sm:text-lg">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
