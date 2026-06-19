import { cn } from "@/lib/utils";

/** Seamless horizontal marquee (used for press / awards strips). */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      aria-hidden
    >
      <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-serif text-2xl font-light text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
