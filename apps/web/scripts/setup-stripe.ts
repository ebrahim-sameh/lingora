/**
 * One-time Stripe setup script.
 *
 * Run after setting STRIPE_SECRET_KEY in .env:
 *   pnpm stripe:setup
 *
 * This script:
 *   1. Creates a billing meter `speaking_minutes` if it doesn't already exist.
 *   2. Creates the three paid products (Starter, Growth, Pro) with recurring base
 *      prices and a metered overage price tied to the meter above.
 *   3. Prints the IDs you should paste into your .env file so the webhook handler
 *      and checkout route can map priceIds ↔ plan tiers.
 *
 * Safe to re-run — it looks up existing products/prices by lookup_key before creating.
 */
import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  console.error('STRIPE_SECRET_KEY is not set. Add it to apps/web/.env.local first.');
  process.exit(1);
}

const stripe = new Stripe(apiKey, {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});

const METER_EVENT_NAME = 'speaking_minutes';
const METER_DISPLAY_NAME = 'Speaking minutes';

interface PlanDefinition {
  tier: 'starter' | 'growth' | 'pro';
  productName: string;
  productLookupKey: string;
  priceLookupKey: string;
  baseAmount: number;
  overageCents: number;
  envVar: string;
}

const PLANS: PlanDefinition[] = [
  {
    tier: 'starter',
    productName: 'Lingora Starter',
    productLookupKey: 'lingora_starter',
    priceLookupKey: 'lingora_starter_monthly',
    baseAmount: 2900,
    overageCents: 40,
    envVar: 'STRIPE_PRICE_STARTER',
  },
  {
    tier: 'growth',
    productName: 'Lingora Growth',
    productLookupKey: 'lingora_growth',
    priceLookupKey: 'lingora_growth_monthly',
    baseAmount: 9900,
    overageCents: 30,
    envVar: 'STRIPE_PRICE_GROWTH',
  },
  {
    tier: 'pro',
    productName: 'Lingora Pro',
    productLookupKey: 'lingora_pro',
    priceLookupKey: 'lingora_pro_monthly',
    baseAmount: 29900,
    overageCents: 20,
    envVar: 'STRIPE_PRICE_PRO',
  },
];

async function ensureMeter() {
  const existing = await stripe.billing.meters.list({ limit: 100 });
  let meter = existing.data.find((m) => m.event_name === METER_EVENT_NAME);
  if (meter) {
    console.log(`✔ Meter already exists: ${meter.id} (${METER_EVENT_NAME})`);
    return meter;
  }

  meter = await stripe.billing.meters.create({
    display_name: METER_DISPLAY_NAME,
    event_name: METER_EVENT_NAME,
    default_aggregation: { formula: 'sum' },
    customer_mapping: { event_payload_key: 'stripe_customer_id', type: 'by_id' },
    value_settings: { event_payload_key: 'value' },
  });
  console.log(`✔ Created meter: ${meter.id} (${METER_EVENT_NAME})`);
  return meter;
}

async function ensureProduct(plan: PlanDefinition) {
  const list = await stripe.products.list({ limit: 100 });
  const existing = list.data.find(
    (p) => p.metadata.lingora_lookup === plan.productLookupKey || p.name === plan.productName,
  );
  if (existing) {
    console.log(`✔ Product exists: ${existing.id} (${plan.productName})`);
    return existing;
  }
  const product = await stripe.products.create({
    name: plan.productName,
    metadata: { lingora_tier: plan.tier, lingora_lookup: plan.productLookupKey },
  });
  console.log(`✔ Created product: ${product.id} (${plan.productName})`);
  return product;
}

async function ensureBasePrice(plan: PlanDefinition, productId: string) {
  const list = await stripe.prices.list({ product: productId, limit: 100, active: true });
  const existing = list.data.find(
    (p) => p.lookup_key === plan.priceLookupKey && p.type === 'recurring',
  );
  if (existing) {
    console.log(`✔ Base price exists: ${existing.id} ($${plan.baseAmount / 100}/mo)`);
    return existing;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: plan.baseAmount,
    recurring: { interval: 'month' },
    lookup_key: plan.priceLookupKey,
    metadata: { lingora_tier: plan.tier },
  });
  console.log(`✔ Created base price: ${price.id} ($${plan.baseAmount / 100}/mo)`);
  return price;
}

async function ensureMeteredOveragePrice(
  plan: PlanDefinition,
  productId: string,
  meterId: string,
) {
  const lookupKey = `${plan.priceLookupKey}_overage`;
  const list = await stripe.prices.list({ product: productId, limit: 100, active: true });
  const existing = list.data.find((p) => p.lookup_key === lookupKey);
  if (existing) {
    console.log(`✔ Overage price exists: ${existing.id} ($${plan.overageCents / 100}/min)`);
    return existing;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    recurring: {
      interval: 'month',
      usage_type: 'metered',
      meter: meterId,
    },
    billing_scheme: 'per_unit',
    unit_amount: plan.overageCents,
    lookup_key: lookupKey,
    metadata: { lingora_tier: plan.tier, price_kind: 'overage' },
  });
  console.log(`✔ Created metered overage price: ${price.id} ($${plan.overageCents / 100}/min)`);
  return price;
}

async function main() {
  console.log('\n🛠  Setting up Stripe products, prices, and meter for Lingora...\n');

  const meter = await ensureMeter();
  const envLines: string[] = [];

  for (const plan of PLANS) {
    console.log(`\n— ${plan.productName} —`);
    const product = await ensureProduct(plan);
    const basePrice = await ensureBasePrice(plan, product.id);
    await ensureMeteredOveragePrice(plan, product.id, meter.id);
    envLines.push(`${plan.envVar}=${basePrice.id}`);
  }
  envLines.push(`STRIPE_METER_ID=${meter.id}`);
  envLines.push(`STRIPE_METER_EVENT_NAME=${METER_EVENT_NAME}`);

  console.log('\n✅ Stripe setup complete.\n');
  console.log('Paste the following into apps/web/.env.local (and Vercel env vars):\n');
  for (const line of envLines) {
    console.log(`  ${line}`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n❌ Stripe setup failed:', err);
  process.exit(1);
});
