import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { FormCard } from "@/components/FormCard";
import { PhoneButton } from "@/components/PhoneButton";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { CONSULTATION, HERO } from "@/lib/content";

export function Consultation(): React.JSX.Element {
  return (
    <section
      id="consultation"
      className="relative isolate overflow-hidden border-t border-[var(--color-border)]"
    >
      {/* Decorative ground photo + charcoal scrim (z-0) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-coastal-home.jpg"
          alt={CONSULTATION.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-bg)]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/85 to-[var(--color-bg)]/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28 lg:px-10 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              eyebrow={CONSULTATION.eyebrow}
              title={CONSULTATION.h2}
              lede={CONSULTATION.lede}
            />
            <Reveal className="mt-8">
              <ul className="flex flex-col gap-3">
                {CONSULTATION.reassurances.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[var(--color-muted)]"
                  >
                    <Icon
                      name="check"
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                      strokeWidth={2.4}
                    />
                    <span className="t-small">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="mt-8">
              <PhoneButton prompt={HERO.phonePrompt} />
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <FormCard idPrefix="consult" routeSlug="/#consultation" />
          </div>
        </div>
      </div>
    </section>
  );
}
