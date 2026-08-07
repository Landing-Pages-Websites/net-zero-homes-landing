import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { FormCard } from "@/components/FormCard";
import { PhoneButton } from "@/components/PhoneButton";
import { HERO } from "@/lib/content";

export function Hero(): React.JSX.Element {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Decorative full-bleed photograph + left-weighted charcoal scrim (z-0) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-coastal-home.jpg"
          alt="An elevated luxury coastal home on pilings under a bright blue Gulf Coast sky, built by Net Zero Construction."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/85 to-[var(--color-bg)]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-[var(--color-bg)]/70" />
      </div>

      {/* Content (z-10) */}
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 pb-10 pt-24 md:px-8 md:pb-24 md:pt-32 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal className="flex flex-col gap-4 md:gap-5">
              <p className="eyebrow">{HERO.eyebrow}</p>
              <h1 className="t-h1 text-[var(--color-text)]">{HERO.h1}</h1>
              <p className="t-body max-w-xl text-[var(--color-muted)]">
                {HERO.subhead}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="mx-auto flex max-w-md flex-col gap-3 lg:max-w-none">
              <FormCard idPrefix="hero" />
              <PhoneButton fullWidth prompt={HERO.phonePrompt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
