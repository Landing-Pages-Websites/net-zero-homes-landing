import { SectionHeading } from "@/components/SectionHeading";
import { FeatureCard } from "@/components/FeatureCard";
import { FramedImage } from "@/components/FramedImage";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { PROCESS } from "@/lib/content";

export function Process(): React.JSX.Element {
  return (
    <section
      id="process"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={PROCESS.eyebrow}
          title={PROCESS.h2}
          lede={PROCESS.lede}
        />

        <Reveal className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
          <FramedImage
            src="/images/icf-aerial-framing.jpg"
            alt="An aerial view of roof and framing work in progress on a Net Zero Construction coastal home."
            aspect="16/9"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <FramedImage
            src="/images/process-aerial-site.jpg"
            alt="An aerial view of an active coastal build site during construction on the Gulf Coast."
            aspect="16/9"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PROCESS.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 60}>
              <FeatureCard num={step.num} title={step.title} body={step.body} />
            </Reveal>
          ))}
        </div>

        <DualCTA
          className="mt-12"
          ghostLabel="See our projects"
          ghostHref="#projects"
        />
      </div>
    </section>
  );
}
