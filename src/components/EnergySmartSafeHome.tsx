import { SectionHeading } from "@/components/SectionHeading";
import { FeatureCard } from "@/components/FeatureCard";
import { FramedImage } from "@/components/FramedImage";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { ENERGY } from "@/lib/content";

export function EnergySmartSafeHome(): React.JSX.Element {
  return (
    <section
      id="energy-smart-safe-home"
      className="py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={ENERGY.eyebrow}
          title={ENERGY.h2}
          lede={ENERGY.lede}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <FramedImage
              src="/images/great-room-envelope.jpg"
              alt="A vaulted great room with a full wall of sliding glass doors in a completed Net Zero Construction home."
              aspect="4/3"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="lg:sticky lg:top-28"
            />
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-7">
            {ENERGY.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 60}>
                <FeatureCard
                  icon={pillar.icon}
                  title={pillar.title}
                  body={pillar.body}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <DualCTA
          className="mt-12"
          ghostLabel="View our work"
          ghostHref="#projects"
        />
      </div>
    </section>
  );
}
