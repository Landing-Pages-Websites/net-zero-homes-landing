import { Icon } from "@/components/icons";

// Dark surface pill with an olive glyph and white label. Factual chips only.
export function TrustChip({
  icon,
  label,
}: {
  icon: string;
  label: string;
}): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text)] md:text-sm">
      <Icon
        name={icon}
        className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
      />
      {label}
    </span>
  );
}
