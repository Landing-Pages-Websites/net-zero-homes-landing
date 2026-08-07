"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { CTA, CONSULT_ANCHOR } from "@/lib/content";

// Mobile-only sticky bar. FORM/CONTACT ONLY — zero tel: links inside it.
// Appears once the hero form scrolls out of view.
export function StickyCTA(): React.JSX.Element {
  const [show, setShow] = useState(false);

  // Scroll visibility (NOT a breakpoint branch — visibility is CSS via lg:hidden).
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-sticky-cta
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={CONSULT_ANCHOR}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-bold text-[var(--color-primary-ink)] transition-colors hover:bg-[var(--color-primary-hover)] hover:text-white"
      >
        {CTA.primary}
        <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
      </a>
    </div>
  );
}
