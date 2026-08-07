import { Icon } from "@/components/icons";
import { CTA, CONSULT_ANCHOR } from "@/lib/content";

interface DualCTAProps {
  ghostLabel: string;
  ghostHref: string;
  primaryLabel?: string;
  primaryHref?: string;
  align?: "start" | "center";
  className?: string;
}

// Every content section closes on this row: a solid olive primary (near-black
// ink) that scrolls to the form, plus a ghost link to the adjacent section.
export function DualCTA({
  ghostLabel,
  ghostHref,
  primaryLabel = CTA.primary,
  primaryHref = CONSULT_ANCHOR,
  align = "start",
  className = "",
}: DualCTAProps): React.JSX.Element {
  const justify = align === "center" ? "justify-center" : "justify-start";
  return (
    <div
      className={`flex flex-wrap items-center gap-x-7 gap-y-4 ${justify} ${className}`}
    >
      <a
        href={primaryHref}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--color-primary)] px-7 py-3.5 font-bold text-[var(--color-primary-ink)] transition-all duration-200 hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:text-white active:translate-y-0 active:bg-[var(--color-primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        {primaryLabel}
        <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
      </a>
      <a
        href={ghostHref}
        className="group inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-[var(--color-accent)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-current">
          {ghostLabel}
        </span>
        <Icon
          name="arrow"
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </a>
    </div>
  );
}
