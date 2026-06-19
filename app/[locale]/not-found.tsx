import { Link } from "@/i18n/routing";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[70svh] flex-col items-center justify-center py-36 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display mt-4">This room doesn&apos;t exist.</h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved or never been designed.
        Let&apos;s get you back to something beautiful.
      </p>
      <Button asChild variant="accent" size="lg" className="mt-10">
        <Link href="/">Return home</Link>
      </Button>
    </Container>
  );
}
