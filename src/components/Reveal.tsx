"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type RevealState = "initial" | "hidden" | "visible";

// Scroll-reveal that NEVER traps content hidden: it renders fully visible on the
// server and first client paint ("initial"), and only applies the fade-up to
// elements that are still below the fold when JS mounts. A safety timeout and a
// no-IntersectionObserver fallback guarantee everything resolves to visible.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("initial");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setState("visible");
      return;
    }

    // Already in/above the viewport → keep visible, no entrance animation.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setState("visible");
      return;
    }

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setState("visible"), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);

    // Safety net: reveal regardless after 1.6s (covers non-scrolling captures).
    const fallback = window.setTimeout(() => {
      setState("visible");
      observer.disconnect();
    }, 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay]);

  const motion =
    state === "initial"
      ? ""
      : `transition-all duration-700 ease-out ${
          state === "visible"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`;

  return (
    <div ref={ref} className={`${motion} ${className}`}>
      {children}
    </div>
  );
}
