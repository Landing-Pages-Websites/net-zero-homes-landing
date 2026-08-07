"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CTA, PHONE, PHONE_HREF } from "@/lib/content";
import { Icon } from "@/components/icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-[0_1px_12px_-6px_rgba(10,22,40,0.25)]"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between py-2.5 md:py-3">
        <Link
          href={CTA.demoAnchor}
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="QBC Systems — TireServ home"
        >
          <Image
            src="/logo.png"
            alt="QBC Systems"
            width={249}
            height={120}
            priority
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={PHONE_HREF}
            className="hidden sm:inline-flex items-center gap-2 border-[1.5px] border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors rounded-lg px-4 py-2 md:py-2.5 font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label={`Call QBC Systems at ${PHONE}`}
          >
            <Icon name="phone" className="w-4 h-4" strokeWidth={0} fill="currentColor" />
            <span>{PHONE}</span>
          </a>
          <a
            href={CTA.demoAnchor}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors rounded-lg px-4 md:px-5 py-2 md:py-2.5 font-semibold text-sm shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {CTA.primary}
            <Icon name="arrow" className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </header>
  );
}
