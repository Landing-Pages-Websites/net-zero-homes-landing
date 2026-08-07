import { Icon } from "@/components/icons";

interface FeatureCardProps {
  icon?: string;
  num?: string;
  title: string;
  body: string;
}

// Dark surface card. `num` renders the numbered-step variant (oversized olive
// numeral); otherwise an olive-tinted glyph square leads the card.
export function FeatureCard({
  icon,
  num,
  title,
  body,
}: FeatureCardProps): React.JSX.Element {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/50">
      {num ? (
        <span
          aria-hidden="true"
          className="font-display text-5xl font-extrabold leading-none text-[var(--color-accent-soft)]"
        >
          {num}
        </span>
      ) : (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/12 text-[var(--color-accent)]">
          <Icon name={icon ?? "shield"} className="h-6 w-6" />
        </span>
      )}
      <h3 className="t-h4 mt-5 text-[var(--color-text)]">{title}</h3>
      <p className="t-small mt-3 leading-relaxed text-[var(--color-muted)]">
        {body}
      </p>
    </article>
  );
}
