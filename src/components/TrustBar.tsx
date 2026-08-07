import { Reveal } from "@/components/Reveal";
import { TrustChip } from "@/components/TrustChip";
import { TRUST_CHIPS } from "@/lib/content";

// The one section with no CTA row, by design — a factual chip strip.
export function TrustBar(): React.JSX.Element {
  return (
    <section
      id="trust-bar"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/40"
    >
      <div className="mx-auto max-w-[1240px] px-5 py-6 md:px-8 md:py-7 lg:px-10">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5">
            {TRUST_CHIPS.map((chip) => (
              <li key={chip.label}>
                <TrustChip icon={chip.icon} label={chip.label} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
