"use client";

import { CTA, PHONE, PHONE_HREF } from "@/lib/content";
import { Icon } from "@/components/icons";

interface DualCTAProps {
  align?: "start" | "center";
  primaryLabel?: string;
  primaryHref?: string;
  /** Use on dark navy bands — switches the phone link to a light-on-dark style. */
  onDark?: boolean;
}

export function DualCTA({
  align = "center",
  primaryLabel = CTA.primary,
  primaryHref = CTA.demoAnchor,
  onDark = false,
}: DualCTAProps) {
  const justify = align === "start" ? "justify-start" : "justify-center";

  const phoneClasses = onDark
    ? "border-[1.5px] border-white/40 text-white hover:bg-white/10 hover:border-white"
    : "border-[1.5px] border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-surface)]";

  return (
    <div className={`flex flex-wrap items-center ${justify} gap-3 mt-8`}>
      <a
        href={primaryHref}
        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 active:bg-[var(--color-primary-active)] transition-all rounded-lg px-7 py-3.5 font-semibold text-base shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        {primaryLabel}
        <Icon name="arrow" className="w-4 h-4" strokeWidth={2.4} />
      </a>
      <a
        href={PHONE_HREF}
        className={`inline-flex items-center gap-2 ${phoneClasses} transition-colors rounded-lg px-6 py-3.5 font-semibold text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]`}
        aria-label={`Call QBC Systems at ${PHONE}`}
      >
        <Icon name="phone" className="w-4 h-4" strokeWidth={0} fill="currentColor" />
        {CTA.secondary}
      </a>
    </div>
  );
}
