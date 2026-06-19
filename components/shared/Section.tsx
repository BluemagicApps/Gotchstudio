import { cn } from "@/lib/utils";
import { Container } from "./Container";

/** Vertical rhythm section wrapper. */
export function Section({
  className,
  children,
  id,
  contained = true,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  contained?: boolean;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28 lg:py-36", className)}
    >
      {contained ? <Container size={size}>{children}</Container> : children}
    </section>
  );
}
