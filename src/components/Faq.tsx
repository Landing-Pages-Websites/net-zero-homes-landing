import { SectionHeading } from "@/components/SectionHeading";
import { DualCTA } from "@/components/DualCTA";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { FAQ } from "@/lib/content";

// Native <details>/<summary> — answers live in the SSR HTML, no hydration needed.
export function Faq(): React.JSX.Element {
  return (
    <section id="faq" className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
        <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.h2} />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="border-t border-[var(--color-border)]">
            {FAQ.items.map((item) => (
              <details
                key={item.q}
                className="group border-b border-[var(--color-border)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]">
                  <span className="t-h4 font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                    {item.q}
                  </span>
                  <Icon
                    name="chevron"
                    className="faq-chevron h-5 w-5 shrink-0 text-[var(--color-accent)]"
                    strokeWidth={2}
                  />
                </summary>
                <p className="pb-6 pr-8 t-body text-[var(--color-muted)]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        <DualCTA
          className="mt-12"
          align="center"
          ghostLabel="Talk with John"
          ghostHref="#consultation"
        />
      </div>
    </section>
  );
}
