import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { WhyIcf } from "@/components/WhyIcf";
import { ProvenInStorms } from "@/components/ProvenInStorms";
import { EnergySmartSafeHome } from "@/components/EnergySmartSafeHome";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { OwnerLed } from "@/components/OwnerLed";
import { Proof } from "@/components/Proof";
import { ServiceArea } from "@/components/ServiceArea";
import { Faq } from "@/components/Faq";
import { Consultation } from "@/components/Consultation";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";

export default function Page(): React.JSX.Element {
  return (
    <main className="overflow-x-hidden">
      <QueryParamPersistence />
      <Header />
      <Hero />
      <TrustBar />
      <WhyIcf />
      <ProvenInStorms />
      <EnergySmartSafeHome />
      <Process />
      <Projects />
      <OwnerLed />
      <Proof />
      <ServiceArea />
      <Faq />
      <Consultation />
      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
