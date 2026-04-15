import type { PlanTier } from './types';

export interface PricingPlan {
  tier: PlanTier;
  name: string;
  priceUsd: number | 'custom';
  priceDescription: string;
  includedMinutes: number;
  maxLanguages: number | 'unlimited';
  overagePerMinuteUsd: number | null;
  features: string[];
  cta: string;
  highlighted?: boolean;
  stripePriceEnv?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'free',
    name: 'Free Trial',
    priceUsd: 0,
    priceDescription: 'Free forever',
    includedMinutes: 10,
    maxLanguages: 1,
    overagePerMinuteUsd: null,
    features: [
      '10 minutes, one-time',
      '1 target language',
      'Listener-unlimited rooms',
      'Watermarked captions',
      'Community support',
    ],
    cta: 'Start free',
  },
  {
    tier: 'starter',
    name: 'Starter',
    priceUsd: 29,
    priceDescription: 'per month',
    includedMinutes: 60,
    maxLanguages: 3,
    overagePerMinuteUsd: 0.4,
    features: [
      '60 speaking minutes/mo',
      'Up to 3 target languages',
      'Unlimited listeners',
      'Live transcript export',
      'Email support',
    ],
    cta: 'Start Starter',
    stripePriceEnv: 'STRIPE_PRICE_STARTER',
  },
  {
    tier: 'growth',
    name: 'Growth',
    priceUsd: 99,
    priceDescription: 'per month',
    includedMinutes: 300,
    maxLanguages: 10,
    overagePerMinuteUsd: 0.3,
    features: [
      '300 speaking minutes/mo',
      'Up to 10 target languages',
      'Unlimited listeners',
      'Custom event branding',
      'Priority support',
      'Session recordings',
    ],
    cta: 'Start Growth',
    highlighted: true,
    stripePriceEnv: 'STRIPE_PRICE_GROWTH',
  },
  {
    tier: 'pro',
    name: 'Pro',
    priceUsd: 299,
    priceDescription: 'per month',
    includedMinutes: 1200,
    maxLanguages: 'unlimited',
    overagePerMinuteUsd: 0.2,
    features: [
      '1,200 speaking minutes/mo',
      'Unlimited target languages',
      'Unlimited listeners',
      'Custom domain',
      'API access (beta)',
      'Dedicated support',
    ],
    cta: 'Start Pro',
    stripePriceEnv: 'STRIPE_PRICE_PRO',
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    priceUsd: 'custom',
    priceDescription: "Let's talk",
    includedMinutes: 0,
    maxLanguages: 'unlimited',
    overagePerMinuteUsd: null,
    features: [
      'Unlimited minutes',
      'SSO / SCIM',
      'On-premise option',
      'Voice cloning',
      'SLA & DPA',
      'White-glove onboarding',
    ],
    cta: 'Contact sales',
  },
];

export const TRIAL_SECONDS_LIMIT = 10 * 60; // 10 minutes

export const METER_EVENT_NAME = 'speaking_minutes';

export function getPlanByTier(tier: PlanTier): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.tier === tier);
}

export function getIncludedSecondsForTier(tier: PlanTier): number {
  const plan = getPlanByTier(tier);
  if (!plan) return 0;
  return plan.includedMinutes * 60;
}
