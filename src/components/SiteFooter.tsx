import Image from "next/image";
import {
  BRAND,
  FOOTER,
  NAV_LINKS,
  PHONE,
  PHONE_HREF,
  CONSULT_ANCHOR,
} from "@/lib/content";
import { Icon } from "@/components/icons";

export function SiteFooter(): React.JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <Image
              src="/brand/logo-white.png"
              alt={BRAND.company}
              width={1136}
              height={245}
              className="h-9 w-auto object-contain"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
              {FOOTER.boilerplate}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Contact
            </h3>
            <address className="mt-4 flex flex-col gap-3 not-italic text-sm text-[var(--color-muted)]">
              <span className="flex items-start gap-2.5">
                <Icon
                  name="pin"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                />
                {BRAND.address}
              </span>
              <a
                href={PHONE_HREF}
                aria-label={`Call ${BRAND.company} at ${PHONE}`}
                className="flex items-center gap-2.5 font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Icon
                  name="phone"
                  className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  strokeWidth={1.6}
                />
                {PHONE}
              </a>
            </address>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Explore
            </h3>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#service-area"
                className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Service Area
              </a>
              <a
                href={CONSULT_ANCHOR}
                className="text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-white"
              >
                Request a Consultation
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center">
          <p>
            © {year} {BRAND.company}. All rights reserved.
          </p>
          <a
            href={BRAND.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-[var(--color-accent)]"
          >
            {BRAND.site}
          </a>
        </div>
      </div>
    </footer>
  );
}
