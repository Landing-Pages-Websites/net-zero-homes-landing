import { Icon } from "@/components/icons";
import { PHONE, PHONE_HREF, BRAND } from "@/lib/content";

interface PhoneButtonProps {
  className?: string;
  fullWidth?: boolean;
  prompt?: string;
}

// Styled phone CTA — olive outline, transparent fill, glyph + CTM number.
// Used in the header, hero and final consultation section (never the sticky bar).
export function PhoneButton({
  className = "",
  fullWidth = false,
  prompt,
}: PhoneButtonProps): React.JSX.Element {
  return (
    <a
      href={PHONE_HREF}
      aria-label={`Call ${BRAND.company} at ${PHONE}`}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border-[1.5px] border-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <Icon name="phone" className="h-[18px] w-[18px]" strokeWidth={1.6} />
      <span>
        {prompt && (
          <span className="mr-1.5 font-normal text-[var(--color-muted)]">
            {prompt}
          </span>
        )}
        {PHONE}
      </span>
    </a>
  );
}
