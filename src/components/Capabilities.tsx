"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { Icon } from "@/components/icons";
import { CAPABILITIES_INTRO, CORE_MODULES, DIFFERENTIATORS } from "@/lib/content";

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Meet TireServ</p>
          <h2 className="mt-3 font-display text-[2rem] md:text-4xl lg:text-[2.9rem] leading-[1.1] text-[var(--color-text)]">
            Everything your operation runs on — in{" "}
            <span className="text-[var(--color-primary)]">one cloud system</span>.
          </h2>
          <p className="mt-5 text-lg text-[var(--color-muted)] leading-relaxed">
            {CAPABILITIES_INTRO}
          </p>
        </Reveal>

        {/* Core ERP modules */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_MODULES.map((mod, i) => (
            <Reveal key={mod.title} delay={i * 60}>
              <article className="group h-full rounded-xl border border-[var(--color-border)] bg-white p-5 transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-card-lg hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
                  <Icon name={mod.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg text-[var(--color-text)]">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{mod.body}</p>
              </article>
            </Reveal>
          ))}
          {/* "All in one" capstone tile */}
          <Reveal delay={CORE_MODULES.length * 60}>
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-xl bg-[var(--color-navy)] p-5 text-white">
              <Image
                src="/images/dashboard-laptop.jpg"
                alt="The TireServ reporting dashboard open on a laptop"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-[var(--color-navy)]/85 to-[var(--color-navy)]/60" />
              <div className="relative">
                <p className="font-display text-2xl font-bold leading-tight">All in one system.</p>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  No bolt-ons, no exporting between tools — every module shares the same live data.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Differentiators — asymmetric feature band */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card-lg ring-1 ring-[var(--color-border)]">
              <Image
                src="/images/mobile-order.jpg"
                alt="A distributor entering a tire order on a tablet"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-deep)]/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 font-display text-lg font-semibold text-white">
                Write orders from the floor, the road, or the customer&apos;s shop.
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <p className="eyebrow">Built for how you actually work</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {DIFFERENTIATORS.map((d, i) => (
                <Reveal key={d.title} delay={i * 70}>
                  <article className="h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-primary)]">
                      <Icon name={d.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-[1.05rem] text-[var(--color-text)]">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{d.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={120}>
          <DualCTA align="center" />
        </Reveal>
      </div>
    </section>
  );
}
