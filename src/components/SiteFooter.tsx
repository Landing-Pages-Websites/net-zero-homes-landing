import Image from "next/image";
import { BRAND, CURRENT_YEAR, PHONE, PHONE_HREF } from "@/lib/content";
import { Icon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-navy-deep)] text-white/70">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <Image
              src="/logo-white.png"
              alt="QBC Systems"
              width={249}
              height={120}
              className="h-11 w-auto object-contain"
            />
            <p className="mt-4 font-display text-lg font-semibold text-white">{BRAND.tagline}</p>
          </div>

          <address className="not-italic md:text-right text-sm leading-relaxed space-y-1.5">
            <p className="font-semibold text-white">QBC Systems, Inc.</p>
            <p>{BRAND.address}</p>
            <p>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 hover:text-white transition-colors md:justify-end"
                aria-label={`Call QBC Systems at ${PHONE}`}
              >
                <Icon name="phone" className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={0} fill="currentColor" />
                {PHONE}
              </a>
            </p>
            <p>
              <a href={BRAND.emailHref} className="hover:text-white transition-colors">
                {BRAND.email}
              </a>
            </p>
          </address>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} QBC Systems, Inc. All rights reserved.</p>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
