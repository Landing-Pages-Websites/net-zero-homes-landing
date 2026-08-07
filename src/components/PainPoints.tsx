"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { Icon } from "@/components/icons";
import { PAIN_POINTS, PAIN_INTRO } from "@/lib/content";

export function PainPoints() {
  return (
    <section id="pain-points" className="relative py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The daily grind</p>
          <h2 className="mt-3 font-display text-[2rem] md:text-4xl lg:text-[2.9rem] leading-[1.1] text-[var(--color-text)]">
            The workarounds that come with outgrowing QuickBooks.
          </h2>
          <p className="mt-5 text-lg text-[var(--color-muted)] leading-relaxed">
            {PAIN_INTRO}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PAIN_POINTS.map((pain, i) => (
            <Reveal key={pain.id} delay={i * 90}>
              <article className="group h-full rounded-2xl bg-white border border-[var(--color-border)] p-7 shadow-card transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-card-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-navy)]/5 text-[var(--color-navy)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <Icon name={pain.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl text-[var(--color-text)]">{pain.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
                  {pain.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Supporting visuals — the operation these workarounds live in */}
        <Reveal delay={120}>
          <div className="mt-12 grid gap-4 sm:grid-cols-5">
            <div className="relative sm:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl shadow-card-lg ring-1 ring-[var(--color-border)]">
              <Image
                src="/images/loading-dock.jpg"
                alt="Tires staged for outbound shipment on a distribution loading dock"
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-deep)]/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 font-display text-lg font-semibold text-white">
                Inventory that moves faster than your spreadsheets can track it.
              </p>
            </div>
            <div className="relative sm:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-card-lg ring-1 ring-[var(--color-border)]">
              <Image
                src="/images/pos-counter.jpg"
                alt="A tire distribution point-of-sale counter serving a customer"
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <DualCTA align="center" />
        </Reveal>
      </div>
    </section>
  );
}
