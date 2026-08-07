import { SectionHeading } from "@/components/SectionHeading";
import { ProjectGallery } from "@/components/ProjectGallery";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { PROJECTS } from "@/lib/content";

export function Projects(): React.JSX.Element {
  return (
    <section id="projects" className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={PROJECTS.eyebrow}
          title={PROJECTS.h2}
          lede={PROJECTS.lede}
        />

        <div className="mt-12">
          <ProjectGallery />
        </div>

        <Reveal className="mt-10">
          <p className="max-w-[68ch] t-body text-[var(--color-muted)]">
            {PROJECTS.closing}
          </p>
        </Reveal>

        <DualCTA
          className="mt-10"
          ghostLabel="Meet the builder"
          ghostHref="#owner-led"
        />
      </div>
    </section>
  );
}
