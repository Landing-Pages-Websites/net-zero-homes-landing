import type { JSX, SVGProps } from "react";

// Single icon family — thin-stroke line icons (24×24, currentColor, 1.5px caps).
// Never emoji. Keys map to the `icon` strings used in content.ts.

type IconPaths = JSX.Element;

const PATHS: Record<string, IconPaths> = {
  // ── Wall / method ──
  wind: (
    <>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8a2.5 2.5 0 1 1-2.5 2.5" />
    </>
  ),
  waves: (
    <>
      <path d="M2 7c1.8 0 1.8 1.6 3.6 1.6S7.4 7 9.2 7s1.8 1.6 3.6 1.6S14.6 7 16.4 7s1.8 1.6 3.6 1.6" />
      <path d="M2 12c1.8 0 1.8 1.6 3.6 1.6S7.4 12 9.2 12s1.8 1.6 3.6 1.6S14.6 12 16.4 12s1.8 1.6 3.6 1.6" />
      <path d="M2 17c1.8 0 1.8 1.6 3.6 1.6S7.4 17 9.2 17s1.8 1.6 3.6 1.6S14.6 17 16.4 17s1.8 1.6 3.6 1.6" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0Z" />
      <path d="M12 9v6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14a6 6 0 0 1-2 0Z" />
      <path d="M9 15c2.5-3 5-4.5 8-5.5" />
    </>
  ),
  // ── Trust chips ──
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  badge: (
    <>
      <path d="M12 2.5 14.4 5l3.4-.3.9 3.3 2.8 2-1.5 3.1 1.5 3.1-2.8 2-.9 3.3-3.4-.3L12 21.5 9.6 19l-3.4.3-.9-3.3-2.8-2 1.5-3.1L2.5 7.7l2.8-2 .9-3.3L9.6 5 12 2.5Z" />
      <path d="m9.3 12 1.9 1.9 3.6-3.8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  // ── UI ──
  phone: (
    <path d="M15.5 3h3a1.5 1.5 0 0 1 1.5 1.6c-.15 2.1-.65 4.1-1.5 5.9a1.4 1.4 0 0 1-1.3.8H15a13 13 0 0 1-9-9V1.8a1.4 1.4 0 0 1 .8-1.3M6.3 4H4.6A1.5 1.5 0 0 0 3 5.5C3.6 13.4 10.6 20.4 18.5 21a1.5 1.5 0 0 0 1.5-1.6v-1.7a1.4 1.4 0 0 0-1.1-1.4l-3-.6a1.4 1.4 0 0 0-1.4.6l-.9 1.2a11 11 0 0 1-4.8-4.8l1.2-.9a1.4 1.4 0 0 0 .5-1.4l-.6-3A1.4 1.4 0 0 0 6.3 4Z" />
  ),
  arrow: <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />,
  check: <path d="m4.5 12.75 6 6 9-13.5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 4.5v15m7.5-7.5h-15" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof PATHS | string;
}

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
  ...rest
}: IconProps): JSX.Element | null {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {path}
    </svg>
  );
}
