"use client";

import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { Icon } from "@/components/icons";
import { WHY, BRAND } from "@/lib/content";

export function WhyPurposeBuilt() {
  return (
    <section
      id="why-purpose-built"
      className="relative isolate overflow-hidden bg-[var(--color-navy)] py-20 md:py-28 text-white"
    >
      <div className="absolute inset-0 -z-10 tex-grid opacity-40" />
      <div className="absolute -top-40 -right-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-[var(--color-primary)]/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-[var(--color-accent)]">Why purpose-built wins</p>
            <h2 className="mt-3 font-display text-[2rem] md:text-4xl lg:text-[2.8rem] leading-[1.1] text-white">
              {WHY.headline}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{WHY.body}</p>

            {/* Stat callout */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <span className="font-display text-5xl font-extrabold text-[var(--color-accent)] leading-none">
                {WHY.statValue}
              </span>
              <span className="text-sm leading-snug text-white/70">{WHY.statLabel}</span>
            </div>
          </Reveal>

          {/* Comparison */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {WHY.comparison.map((col, i) => {
              const isTireServ = col.side === "tireserv";
              return (
                <Reveal key={col.side} delay={i * 90}>
                  <div
                    className={`h-full rounded-2xl p-6 ${
                      isTireServ
                        ? "bg-white text-[var(--color-text)] shadow-card-lg ring-1 ring-[var(--color-primary)]"
                        : "border border-white/12 bg-white/[0.03] text-white/85"
                    }`}
                  >
                    <p
                      className={`font-display text-lg font-semibold ${
                        isTireServ ? "text-[var(--color-primary)]" : "text-white/60"
                      }`}
                    >
                      {col.label}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {col.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isTireServ
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-white/10 text-white/50"
                            }`}
                          >
                            <Icon
                              name={isTireServ ? "check" : "x"}
                              className="h-3 w-3"
                              strokeWidth={isTireServ ? 3 : 2.2}
                            />
                          </span>
                          <span className={isTireServ ? "text-[var(--color-muted)]" : ""}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={140}>
          <p className="mt-10 text-center text-sm text-white/50">
            {BRAND.company} · {BRAND.tagline}
          </p>
          <DualCTA align="center" onDark />
        </Reveal>
      </div>
    </section>
  );
}
