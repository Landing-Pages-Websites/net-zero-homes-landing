import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Single-family Manrope — display + body. Hierarchy comes from weight/size/tracking.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// === MEGA TAG CONFIG === (real Net Zero Construction values)
const SITE_KEY = "wo1w9pgf74jtof46";
const SITE_ID = "e3ef990d-4df5-4654-8a43-64d0c96a55ab";
const GTM_ID = "GTM-PCKBHNHB";
const PIXEL_ID = "4326648287565669";

export const metadata: Metadata = {
  metadataBase: new URL("https://info.netzerohomes.build"),
  title:
    "Luxury Hurricane-Resistant Custom Homes on Florida's Gulf Coast | Net Zero Construction",
  description:
    "Net Zero Construction builds luxury custom coastal homes with Insulated Concrete Forms (ICF) — engineered for hurricane resistance, energy efficiency and long-term peace of mind on Florida's Gulf Coast. Owner-led by John Wolterman, 25+ years of experience. Request a consultation.",
  openGraph: {
    title:
      "Built to Protect Your Family & Your Investment | Net Zero Construction",
    description:
      "Custom coastal homes built with Insulated Concrete Forms — engineered for hurricane resistance and energy efficiency on Florida's Gulf Coast. A limited number of custom homes each year, personally led by owner John Wolterman.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: { index: false, follow: false }, // ads LP — not indexed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The optimizer injects BOTH GTM and the Meta Pixel from this config —
  // we hand-write NO GTM loader, <noscript> iframe, or fbq('init') block.
  const megaTagConfig = `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",siteId:"${SITE_ID}",gtmId:"${GTM_ID}",pixelId:"${PIXEL_ID}"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`;

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <meta name="mega-site-id" content={SITE_ID} />
        <script
          id="mega-tag-config"
          dangerouslySetInnerHTML={{ __html: megaTagConfig }}
        />
        <script
          id="optimizer-script"
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          data-site-id={SITE_ID}
          async
        />
      </head>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        {children}
        {/* CallTrackingMetrics — universal Mega account (never remove) */}
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
