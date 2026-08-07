"use client";

import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { Icon } from "@/components/icons";
import { PROOF_STATS, PROOF_PARAGRAPH, BRAND } from "@/lib/content";

export function ProofBar() {
  return (
    <section id="proof" className="relative py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why distributors trust QBC</p>
          <h2 className="mt-3 font-display text-[2rem] md:text-4xl lg:text-[2.7rem] leading-[1.1] text-[var(--color-text)]">
            Specialists in tire distribution — not generalists.
          </h2>
        </Reveal>

        {/* Stat / badge bar */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-4">
          {PROOF_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <div className="h-full bg-white p-6 text-center">
                <p className="font-display text-2xl md:text-[1.75rem] font-bold text-[var(--color-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-snug">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust paragraph */}
        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white border border-[var(--color-border)] p-8 md:p-10 shadow-card text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Icon name="phone" className="h-5 w-5" strokeWidth={0} fill="currentColor" />
            </div>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text)]">{PROOF_PARAGRAPH}</p>
            <p className="mt-5 font-display text-xl font-semibold text-[var(--color-primary)]">
              {BRAND.tagline}
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <DualCTA align="center" />
        </Reveal>
      </div>
    </section>
  );
}
