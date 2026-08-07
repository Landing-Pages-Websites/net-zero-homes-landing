import { SectionHeading } from "@/components/SectionHeading";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { SERVICE_AREA } from "@/lib/content";

export function ServiceArea(): React.JSX.Element {
  return (
    <section
      id="service-area"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading
          eyebrow={SERVICE_AREA.eyebrow}
          title={SERVICE_AREA.h2}
          lede={SERVICE_AREA.body}
        />

        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-2.5 md:gap-3">
            {SERVICE_AREA.cities.map((city) => (
              <li
                key={city}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)]"
              >
                <Icon
                  name="pin"
                  className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                />
                {city}
              </li>
            ))}
          </ul>
        </Reveal>

        <DualCTA
          className="mt-12"
          ghostLabel="Read the FAQ"
          ghostHref="#faq"
        />
      </div>
    </section>
  );
}
