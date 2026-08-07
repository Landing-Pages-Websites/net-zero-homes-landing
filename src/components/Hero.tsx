"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { FormCard } from "@/components/FormCard";
import { Icon } from "@/components/icons";
import { HERO, PHONE, PHONE_HREF } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[var(--color-navy)] pt-20 md:pt-28 pb-12 md:pb-20"
    >
      {/* Background imagery + navy wash */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-warehouse.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-navy)] via-[var(--color-navy)]/95 to-[var(--color-navy-deep)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy-deep)]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 tex-grid opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-7">
          <Reveal className="space-y-5 md:space-y-6">
            <ul className="flex flex-wrap gap-2">
              {HERO.chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                >
                  <Icon name="check" className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2.5} />
                  {chip}
                </li>
              ))}
            </ul>

            <h1 className="font-display font-extrabold text-white leading-[1.05] tracking-[-0.02em] text-[2.15rem] sm:text-5xl lg:text-[3.9rem]">
              {HERO.h1Lead && (
                <span className="text-[var(--color-accent)]">{HERO.h1Lead}</span>
              )}{" "}
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-[#5fd0ff] bg-clip-text text-transparent">
                {HERO.h1Accent}
              </span>
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-white/80">
              {HERO.subhead}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md px-1"
                aria-label={`Call QBC Systems at ${PHONE}`}
              >
                <Icon name="phone" className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={0} fill="currentColor" />
                <span>
                  <span className="text-white/60 font-normal text-sm mr-1.5">Prefer to talk?</span>
                  {PHONE}
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <div id="demo" className="lg:col-span-5 scroll-mt-24">
          <Reveal delay={120}>
            <FormCard idPrefix="hero" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
