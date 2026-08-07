"use client";

import { useTracking } from "@/hooks/useTracking";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PainPoints } from "@/components/PainPoints";
import { Capabilities } from "@/components/Capabilities";
import { WhyPurposeBuilt } from "@/components/WhyPurposeBuilt";
import { ProofBar } from "@/components/ProofBar";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingCTA } from "@/components/FloatingCTA";
import { TRACKING } from "@/lib/content";

export default function Page() {
  useTracking({
    siteKey: TRACKING.siteKey,
    siteId: TRACKING.siteId,
    gtmId: TRACKING.gtmId,
  });

  return (
    <main className="overflow-x-hidden bg-white">
      <QueryParamPersistence />
      <Header />
      <Hero />
      <PainPoints />
      <Capabilities />
      <WhyPurposeBuilt />
      <ProofBar />
      <Faq />
      <FinalCta />
      <SiteFooter />
      <FloatingCTA />
    </main>
  );
}
