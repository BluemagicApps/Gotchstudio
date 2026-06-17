import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { footerNav, siteConfig } from "@/config/site";
import { Container } from "@/components/shared/Container";
import { Newsletter } from "@/components/shared/Newsletter";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div className="space-y-6">
            <Link
              href="/"
              className="font-serif text-2xl font-light tracking-[0.12em]"
            >
              GOTCH<span className="text-accent">.</span>STUDIO
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {tf("blurb")}
            </p>
            <div className="space-y-2">
              <p className="eyebrow">{tf("newsletter")}</p>
              <Newsletter />
            </div>
          </div>

          {/* Studio links */}
          <FooterCol title={tf("studio")}>
            {footerNav.studio.map((i) => (
              <FooterLink key={i.key} href={i.href} label={t(i.key)} />
            ))}
          </FooterCol>

          {/* Work links */}
          <FooterCol title={tf("work")}>
            {footerNav.work.map((i) => (
              <FooterLink key={i.key} href={i.href} label={t(i.key)} />
            ))}
          </FooterCol>

          {/* Contact */}
          <FooterCol title={tf("visit")}>
            <p className="text-sm text-muted-foreground">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.locality}, {siteConfig.address.region}{" "}
              {siteConfig.address.postalCode}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="block text-sm text-muted-foreground link-underline w-fit"
            >
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.phoneHref}
              className="block text-sm text-muted-foreground link-underline w-fit"
            >
              {siteConfig.phone}
            </a>
            <div className="flex gap-3 pt-2">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {tf("rights")}
          </p>
          <div className="flex gap-6">
            {footerNav.legal.map((i) => (
              <Link key={i.key} href={i.href} className="link-underline">
                {t(i.key)}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="eyebrow">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}
