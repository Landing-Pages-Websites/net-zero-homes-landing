import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "start" | "center";
  className?: string;
}

// The consistent three-part rhythm — eyebrow / h2 / optional lede — used on
// every content section. White heading on the dark ground.
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "start",
  className = "",
}: SectionHeadingProps): React.JSX.Element {
  const alignment =
    align === "center" ? "text-center items-center mx-auto" : "text-left";
  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="t-h2 mt-3 max-w-[20ch] text-[var(--color-text)]">
        {title}
      </h2>
      {lede && (
        <p
          className={`t-body mt-5 max-w-[62ch] text-[var(--color-muted)] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
