import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingNavbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { FAQ } from '@/components/marketing/faq';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, fair, metered pricing. Unlimited listeners on every plan. Pay only for speaker minutes × target languages.',
};

export default function PricingPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="relative pt-32 pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,hsl(239_84%_67%/0.15)_0%,transparent_60%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Pricing
            </div>
            <h1 className="mt-3 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              One price. Unlimited listeners.
            </h1>
            <p className="mt-5 text-balance text-lg text-muted-foreground">
              A "minute" = 1 minute of speaker audio × 1 target language. Unlimited listeners are
              always included. No per-seat fees. No hidden extras. No sales call unless you want one.
            </p>
          </div>
          <div className="mt-14">
            <PricingCards variant="full" />
          </div>
          <div className="mt-20 grid gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-3 sm:p-12">
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Languages supported on every plan
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">&lt;1s</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Median translation latency
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Listeners per session, every tier
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center rounded-2xl border border-border bg-gradient-to-b from-card to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to go live?</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Create a session in under 30 seconds. Test it with ten of your minutes, on us.
            </p>
            <Button size="xl" variant="gradient" className="mt-6" asChild>
              <Link href="/sign-up">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-12">
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
