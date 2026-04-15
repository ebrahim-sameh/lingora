import { MarketingNavbar } from '@/components/marketing/navbar';
import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { UseCases } from '@/components/marketing/use-cases';
import { PricingSection } from '@/components/marketing/pricing-section';
import { Testimonials } from '@/components/marketing/testimonials';
import { FAQ } from '@/components/marketing/faq';
import { CTA } from '@/components/marketing/cta';
import { Footer } from '@/components/marketing/footer';

export default function HomePage() {
  return (
    <>
      <MarketingNavbar />
      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <PricingSection />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
