"use client";

import { Reveal } from "@/components/Reveal";
import { FormCard } from "@/components/FormCard";
import { Icon } from "@/components/icons";
import { FINAL_CTA, PHONE, PHONE_HREF } from "@/lib/content";

export function FinalCta() {
  return (
    <section
      id="get-started"
      className="relative isolate overflow-hidden bg-[var(--color-navy-deep)] py-20 md:py-28 text-white"
    >
      <div className="absolute inset-0 -z-10 tex-grid opacity-30" />
      <div className="absolute -bottom-40 -left-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[var(--color-primary)]/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <Reveal>
            <p className="eyebrow text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-3 font-display text-[2rem] md:text-4xl lg:text-[2.9rem] leading-[1.1] text-white">
              {FINAL_CTA.headline}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{FINAL_CTA.body}</p>

            <div className="mt-8">
              <p className="text-sm text-white/60">Prefer to talk first?</p>
              <a
                href={PHONE_HREF}
                className="mt-2 inline-flex items-center gap-3 font-display text-3xl md:text-4xl font-bold text-white hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md"
                aria-label={`Call QBC Systems at ${PHONE}`}
              >
                <Icon name="phone" className="h-7 w-7 text-[var(--color-accent)]" strokeWidth={0} fill="currentColor" />
                {PHONE}
              </a>
              <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
                <Icon name="check" className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.5} />
                Every request gets a response within one business day.
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <FormCard
              idPrefix="final"
              eyebrow="Request your free demo"
              heading="Book your TireServ walkthrough"
              subheading="Free, no commitment — a scoped quote comes with every demo."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
