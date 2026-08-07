"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CONSULT_ANCHOR, BRAND, CTA } from "@/lib/content";
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
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-4 md:h-[80px] md:px-8 lg:px-10">
        <a
          href="#hero"
          aria-label={`${BRAND.company} — home`}
          className="flex min-w-0 max-w-[224px] shrink items-center rounded-md mr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:mr-0 md:max-w-none"
        >
          <Image
            src="/brand/logo-white.png"
            alt={BRAND.company}
            width={1136}
            height={245}
            priority
            className="h-12 w-auto object-contain md:h-14"
          />
        </a>

        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="hidden sm:block">
            <PhoneButton className="px-4 py-2.5 text-sm" />
          </div>
          <a
            href={CONSULT_ANCHOR}
            aria-label={CTA.primary}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-sm font-bold text-[var(--color-primary-ink)] transition-all hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:text-white active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:px-5"
          >
            <span className="md:hidden">Consultation</span>
            <span className="hidden md:inline">{CTA.primary}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
