import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { PROJECTS } from "@/lib/content";

// Asymmetric editorial grid — a 6-col desktop layout that collapses to a single
// column on mobile. Every image appears exactly once across the whole page.
const SPANS = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

export function ProjectGallery(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-6">
      {PROJECTS.images.map((img, i) => (
        <Reveal key={img.src} delay={(i % 3) * 60} className={SPANS[i]}>
          <figure
            className="group relative h-full overflow-hidden rounded-xl border border-[var(--color-border)]"
            style={{ aspectRatio: img.aspect }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-bg)]/85 via-[var(--color-bg)]/25 to-transparent p-4 pt-10">
              <figcaption className="text-sm font-semibold text-white">
                {img.caption}
              </figcaption>
            </div>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
