import { SectionHeading } from "@/components/SectionHeading";
import { FramedImage } from "@/components/FramedImage";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { PROVEN } from "@/lib/content";

export function ProvenInStorms(): React.JSX.Element {
  return (
    <section
      id="proven-in-storms"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={PROVEN.eyebrow}
          title={PROVEN.h2}
          lede={PROVEN.body}
        />

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <FramedImage
              src="/images/storm-proven-home.jpg"
              alt="A completed Net Zero Construction coastal home standing intact among palms in bright Gulf Coast light."
              aspect="16/9"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border-l-2 border-[var(--color-primary)] bg-[var(--color-sand)] p-8 md:p-10">
              <p className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[var(--color-primary-hover)]">
                {PROVEN.approach.label}
              </p>
              <p className="t-h4 mt-4 font-medium leading-relaxed text-[var(--color-text-dark)]">
                {PROVEN.approach.statement}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <p className="max-w-[68ch] border-l-2 border-[var(--color-primary)] pl-5 text-[var(--color-muted)] t-body">
            {PROVEN.closing}
          </p>
        </Reveal>

        <DualCTA className="mt-12" ghostLabel="Why ICF" ghostHref="#why-icf" />
      </div>
    </section>
  );
}
