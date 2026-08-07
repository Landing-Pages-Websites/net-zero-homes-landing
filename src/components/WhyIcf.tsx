import { SectionHeading } from "@/components/SectionHeading";
import { FeatureCard } from "@/components/FeatureCard";
import { FramedImage } from "@/components/FramedImage";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { WHY_ICF } from "@/lib/content";

export function WhyIcf(): React.JSX.Element {
  return (
    <section id="why-icf" className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={WHY_ICF.eyebrow}
          title={WHY_ICF.h2}
          lede={WHY_ICF.lede}
        />

        {/* Lead ICF pour photo + supporting estate-walls photo */}
        <Reveal className="mt-12 grid gap-4 md:grid-cols-5 md:gap-6">
          <FramedImage
            src="/images/icf-wall-pour.jpg"
            alt="Insulated Concrete Form wall forms filled with rebar during a mid-pour on a Net Zero Construction foundation."
            aspect="4/3"
            className="md:col-span-3"
            sizes="(min-width: 768px) 60vw, 100vw"
          />
          <FramedImage
            src="/images/icf-estate-walls.jpg"
            alt="A large custom estate with Insulated Concrete Form block walls going up on the Gulf Coast."
            aspect="4/3"
            className="md:col-span-2"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </Reveal>

        {/* Four cards, full body copy */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {WHY_ICF.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <FeatureCard
                icon={card.icon}
                title={card.title}
                body={card.body}
              />
            </Reveal>
          ))}
        </div>

        <DualCTA
          className="mt-12"
          ghostLabel="See our process"
          ghostHref="#process"
        />
      </div>
    </section>
  );
}
