import { cn } from "@/lib/utils";

/** Centered max-width content wrapper with responsive padding. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[1600px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
