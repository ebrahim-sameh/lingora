'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_PLANS, type PricingPlan } from '@lingora/shared/pricing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardsProps {
  variant?: 'landing' | 'full';
}

export function PricingCards({ variant = 'landing' }: PricingCardsProps) {
  const plans = variant === 'landing' ? PRICING_PLANS.filter((p) => p.tier !== 'enterprise') : PRICING_PLANS;

  return (
    <div
      className={cn(
        'grid gap-6',
        plans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-5',
      )}
    >
      {plans.map((plan) => (
        <PricingCard key={plan.tier} plan={plan} />
      ))}
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const highlighted = plan.highlighted;
  const href =
    plan.tier === 'enterprise'
      ? 'mailto:sales@lingora.app?subject=Lingora%20Enterprise'
      : plan.tier === 'free'
        ? '/sign-up'
        : `/sign-up?plan=${plan.tier}`;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all',
        highlighted
          ? 'border-primary bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent shadow-[0_0_60px_-15px_hsl(239_84%_67%/0.6)] lg:scale-[1.03]'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <Sparkles className="h-3 w-3" /> Most popular
          </span>
        </div>
      )}

      <div className="text-lg font-semibold">{plan.name}</div>
      <div className="mt-4 flex items-baseline gap-1">
        {plan.priceUsd === 'custom' ? (
          <span className="text-4xl font-bold tracking-tight">Custom</span>
        ) : plan.priceUsd === 0 ? (
          <span className="text-4xl font-bold tracking-tight">Free</span>
        ) : (
          <>
            <span className="text-4xl font-bold tracking-tight">${plan.priceUsd}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </>
        )}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{plan.priceDescription}</div>

      <div className="mt-6 border-t border-border pt-6">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.overagePerMinuteUsd !== null && (
        <div className="mt-4 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          Overage: <span className="font-mono font-semibold text-foreground">${plan.overagePerMinuteUsd.toFixed(2)}</span>/min per language
        </div>
      )}

      <div className="mt-6 flex-1" />
      <Button
        asChild
        variant={highlighted ? 'gradient' : 'outline'}
        size="lg"
        className="w-full"
      >
        <Link href={href}>{plan.cta}</Link>
      </Button>
    </div>
  );
}
