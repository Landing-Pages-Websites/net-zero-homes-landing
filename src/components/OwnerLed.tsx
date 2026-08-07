import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCard } from "@/components/TestimonialCard";
import { FramedImage } from "@/components/FramedImage";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { OWNER, GETREAL_TESTIMONIAL } from "@/lib/content";

export function OwnerLed(): React.JSX.Element {
  return (
    <section
      id="owner-led"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <FramedImage
              src="/images/team-john-wolterman.jpg"
              alt={OWNER.imageAlt}
              aspect="3/2"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>

          <div>
            <SectionHeading eyebrow={OWNER.eyebrow} title={OWNER.h2} />
            <Reveal className="mt-5">
              <p className="t-body text-[var(--color-muted)]">{OWNER.body}</p>
            </Reveal>
            <Reveal className="mt-8">
              <TestimonialCard testimonial={GETREAL_TESTIMONIAL} />
            </Reveal>
          </div>
        </div>

        <DualCTA
          className="mt-12"
          ghostLabel="Read what clients say"
          ghostHref="#proof"
        />
      </div>
    </section>
  );
}
