"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_LINKS, CONSULT_ANCHOR, BRAND, CTA } from "@/lib/content";
import { PhoneButton } from "@/components/PhoneButton";

export function Header(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);

  // Scroll-based background deepen (NOT a breakpoint branch — layout is pure CSS).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? "border-[var(--color-border)] bg-[var(--color-bg)]/95"
          : "border-[var(--color-border)]/60 bg-[var(--color-bg)]/85"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:h-[76px] md:px-8 lg:px-10">
        <a
          href="#hero"
          aria-label={`${BRAND.company} — home`}
          className="flex max-w-[190px] items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:max-w-none"
        >
          <Image
            src="/brand/logo-white.png"
            alt={BRAND.company}
            width={1136}
            height={245}
            priority
            className="h-8 w-auto object-contain md:h-10"
          />
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="hidden sm:block">
            <PhoneButton className="px-4 py-2.5 text-sm" />
          </div>
          <a
            href={CONSULT_ANCHOR}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-primary-ink)] transition-all hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:text-white active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:px-5"
          >
            {CTA.primary}
          </a>
        </div>
      </div>
    </header>
  );
}
