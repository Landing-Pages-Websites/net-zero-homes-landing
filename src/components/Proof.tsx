import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCard } from "@/components/TestimonialCard";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { PROOF, CLIENT_TESTIMONIALS } from "@/lib/content";

export function Proof(): React.JSX.Element {
  return (
    <section id="proof" className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading eyebrow={PROOF.eyebrow} title={PROOF.h2} />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CLIENT_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.attribution} delay={i * 60}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <p className="text-sm text-[var(--color-muted)]">{PROOF.pressLine}</p>
        </Reveal>

        <DualCTA
          className="mt-12"
          ghostLabel="See our service area"
          ghostHref="#service-area"
        />
      </div>
    </section>
  );
}
