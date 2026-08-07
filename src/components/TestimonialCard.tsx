import type { Testimonial } from "@/lib/content";

// editorial-pull = larger sand card with dark ink; client-quote = dark surface
// card with white ink. Quotes are not interactive — no hover state.
export function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}): React.JSX.Element {
  const { variant, quote, attribution, role } = testimonial;

  if (variant === "editorial-pull") {
    return (
      <figure className="rounded-2xl border border-[var(--color-sand)] bg-[var(--color-sand)] p-8 md:p-10">
        <QuoteMark className="text-[var(--color-primary)]" />
        <blockquote className="t-h4 mt-4 font-medium leading-relaxed text-[var(--color-text-dark)]">
          “{quote}”
        </blockquote>
        <figcaption className="mt-6 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[var(--color-primary-hover)]">
          {attribution}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
      <QuoteMark className="text-[var(--color-accent)]" />
      <blockquote className="t-body mt-4 leading-relaxed text-[var(--color-text)]">
        “{quote}”
      </blockquote>
      <figcaption className="mt-6 text-sm">
        <span className="font-bold text-[var(--color-text)]">
          {attribution}
        </span>
        {role && (
          <span className="mt-0.5 block text-[var(--color-muted)]">{role}</span>
        )}
      </figcaption>
    </figure>
  );
}

function QuoteMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 32 24"
      className={`h-6 w-8 ${className ?? ""}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 24V13.2C0 5.9 4.5 1.2 12 0l1.3 3.4C9.2 4.9 7 7.4 6.8 11H12v13H0Zm18 0V13.2C18 5.9 22.5 1.2 30 0l1.3 3.4C27.2 4.9 25 7.4 24.8 11H30v13H18Z" />
    </svg>
  );
}
