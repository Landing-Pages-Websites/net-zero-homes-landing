import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display-active",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-active",
  display: "swap",
});

// === MEGA TAG CONFIG === (real QBC values — QBC opted out of Meta, so NO pixelId)
const SITE_KEY = "5rn5f8eze80jvipf";
const SITE_ID = "a6d7ae94-3574-4c2a-9642-4385d223e4e7";
const GTM_ID = "GTM-5PN93D";

export const metadata: Metadata = {
  title:
    "TireServ ERP — Free Demo for Tire & Automotive Wholesale Distributors | QBC Systems",
  description:
    "TireServ is the ERP built exclusively for tire & automotive wholesale distributors. POS, inventory, purchasing, AR, AP, GL, and reporting in one cloud system with real-time wholesale integration. Purpose-built over 48 years. Get a free demo.",
  openGraph: {
    title: "TireServ ERP — Built Exclusively for Tire Wholesale Distributors",
    description:
      "One cloud system for POS, inventory, purchasing, and accounting — with real-time wholesale integration and mobile order entry. Purpose-built over 48 years by QBC Systems.",
    images: ["/images/hero-warehouse.jpg"],
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
  const megaTagConfig = `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",siteId:"${SITE_ID}",gtmId:"${GTM_ID}"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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
        <Script
          src="https://572388.tctm.co/t.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
