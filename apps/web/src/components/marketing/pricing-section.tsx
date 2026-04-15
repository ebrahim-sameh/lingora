import { PricingCards } from './pricing-cards';

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Simple, fair, metered
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            You only pay when you're speaking.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            A "minute" = one minute of speaker audio, in one target language. Unlimited listeners
            included on every plan. No per-seat fees, no hidden tiers, no surprise bills.
          </p>
        </div>

        <div className="mt-14">
          <PricingCards />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Need something custom?{' '}
          <a
            href="mailto:sales@lingora.app"
            className="font-semibold text-foreground underline underline-offset-4 hover:text-primary"
          >
            Talk to sales →
          </a>
        </div>
      </div>
    </section>
  );
}
