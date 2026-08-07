import Image from "next/image";

interface FramedImageProps {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

// Contained, un-scrimmed image in a rounded frame with a hairline border.
export function FramedImage({
  src,
  alt,
  aspect = "4/3",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: FramedImageProps): React.JSX.Element {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
