# Lingora

> **Speak once. Heard everywhere.**

Real-time AI live translation for churches, conferences, sports events, lectures, corporate all-hands, and any gathering where people from different languages need to hear the same speaker at the same time.

A speaker talks. Listeners scan a QR code, pick their language, and hear the speaker translated into their language through their browser — in under a second. No app install. Unlimited listeners per event. 100+ languages.

This is the monorepo for the full product: Next.js web app, Drizzle database schema, Stripe metered billing, and a standalone Node worker that bridges LiveKit audio through Gladia → Gemini 2.5 → Cartesia Sonic-3 per target language.

---

## Architecture

```
 ┌──────────────────┐    WebRTC mic     ┌────────────────────────────────┐
 │ Speaker phone/PC │ ────────────────▶ │  LiveKit Cloud Room            │
 └──────────────────┘                   │  lingora-ABC123                │
                                        └────────────────┬───────────────┘
                                                         │ speaker audio
                                                         ▼
                          ┌──────────────────────────────────────────────┐
                          │ apps/worker (Node, long-lived)               │
                          │                                              │
                          │  For each target language:                   │
                          │    Gladia Solaria-1 WS  (ASR, partials)      │
                          │          ↓                                   │
                          │    Gemini 2.5 Flash stream  (translate)      │
                          │          ↓                                   │
                          │    Cartesia Sonic-3 WS  (TTS)                │
                          │          ↓                                   │
                          │    LiveKit track `translation-<lang>`        │
                          └──────────────────────┬───────────────────────┘
                                                 │ translated audio
                                                 ▼
 ┌──────────────────┐    WebRTC audio    ┌────────────────────────────────┐
 │ Listener phones  │ ◀───────────────── │  subscribe to one language     │
 └──────────────────┘                    └────────────────────────────────┘
```

Usage is reported every 30 seconds by the worker to `/api/usage`, which persists the event in Postgres and forwards it to Stripe's billing meter. Free-trial users get quota-enforced at the API layer.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui primitives |
| Auth | Clerk |
| Database | Neon serverless Postgres + Drizzle ORM |
| Payments | Stripe Billing Meters API (metered subscriptions) |
| Transport | LiveKit Cloud (WebRTC fan-out) |
| ASR | Gladia Solaria-1 streaming WebSocket |
| Translation | Google Gemini 2.5 Flash streaming |
| TTS | Cartesia Sonic-3 streaming WebSocket |
| Monorepo | pnpm workspaces + Turborepo |
| Web hosting | Vercel |
| Worker hosting | Docker → Railway / Fly.io / Render |

---

## Repository layout

```
lingora/
├── apps/
│   ├── web/           # Next.js 15 app — landing, pricing, auth, dashboard, listener
│   └── worker/        # Standalone Node worker — LiveKit room bridge + pipeline
├── packages/
│   ├── db/            # Drizzle schema + migrations + query client
│   └── shared/        # Languages list, Cartesia voice map, pricing config, types
├── .env.example       # Full env variable reference
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prerequisites

- **Node 20+** (Node 18.18+ works; 20 is recommended)
- **pnpm 9+** (`corepack enable` will do)
- Accounts with working API keys for: Clerk, Neon, Stripe (test mode is fine), LiveKit Cloud, Gladia, Google AI Studio, Cartesia

---

## Getting the API keys

| Service | Where to get it | What to set |
| --- | --- | --- |
| Clerk | https://dashboard.clerk.com → new application | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, webhook secret |
| Neon | https://console.neon.tech → new project | `DATABASE_URL` (use the pooled connection string) |
| Stripe | https://dashboard.stripe.com/test/apikeys | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, webhook secret |
| LiveKit | https://cloud.livekit.io → new project | `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` |
| Gladia | https://app.gladia.io → API keys | `GLADIA_API_KEY` |
| Gemini | https://aistudio.google.com/app/apikey | `GEMINI_API_KEY` |
| Cartesia | https://play.cartesia.ai/api-keys | `CARTESIA_API_KEY` |

Copy `.env.example` → `apps/web/.env.local`, fill in the values, and mirror the non-public ones into your Vercel project (and into your worker host's secrets).

---

## Local setup

```bash
# 1) Install dependencies (monorepo hoisted)
pnpm install

# 2) Fill out apps/web/.env.local based on .env.example

# 3) Push the Drizzle schema to Neon
pnpm db:push

# 4) Create Stripe products, prices, and the speaking_minutes meter
pnpm stripe:setup
# ^ prints the STRIPE_PRICE_* and STRIPE_METER_ID env vars. Paste them into
#   .env.local and Vercel.

# 5) Run the web app (landing + dashboard + listener)
pnpm dev
# open http://localhost:3000

# 6) Run the worker (optional locally; required for real translation)
pnpm --filter @lingora/worker dev
```

Once both the web app and worker are running, create a session from the dashboard, open the listener URL on a phone, and start speaking.

---

## Deployment

### Web app → Vercel

```bash
pnpm dlx vercel link
pnpm dlx vercel env pull .env.production.local   # optional: pull existing
pnpm dlx vercel --prod
```

All the env vars in `.env.example` (minus the worker-only ones) should be set in your Vercel project settings for Production. The `/api/stripe/webhook` and `/api/clerk/webhook` endpoints must be reachable from Stripe and Clerk respectively — Vercel's auto-generated URL is fine.

### Worker → Railway (recommended) / Fly.io / any Node host

```bash
docker build -f apps/worker/Dockerfile -t lingora-worker .
# push to your registry, then deploy with the env vars from .env.example
# (LiveKit, Gladia, Gemini, Cartesia, WORKER_USAGE_*)
```

The worker polls LiveKit every 5 seconds for rooms named `lingora-*` and joins any new ones. Scale horizontally: each worker instance handles many rooms, and rooms are evenly distributed since the worker is stateless. A single small instance (512 MB RAM) is plenty for <50 concurrent rooms.

---

## Pricing tiers

| Tier | Price | Included | Overage |
| --- | --- | --- | --- |
| Free Trial | $0 | 10 min total, 1 language | locked |
| Starter | $29/mo | 60 min/mo, up to 3 languages | $0.40/min |
| Growth | $99/mo | 300 min/mo, up to 10 languages | $0.30/min |
| Pro | $299/mo | 1,200 min/mo, unlimited languages | $0.20/min |
| Enterprise | custom | custom | custom |

A "minute" = 1 minute of speaker audio × 1 target language. Unlimited listeners are always included. Voice cloning, SSO, on-premise, and SLAs ship with Enterprise.

---

## Decisions made (since this was a single-session autonomous build)

- **Worker framework.** Chose raw `@livekit/rtc-node` for the worker instead of `@livekit/agents`. Agents is optimized for single-participant voice pipelines; we need a bridge that subscribes to one track and publishes N.
- **Translation cadence.** Cartesia is triggered on Gladia *final* transcripts rather than partial, to avoid mid-utterance voice stutter. We keep a rolling 3-utterance context window that we feed Gemini as disambiguation. Token-level streaming into Sonic-3 (lower latency, mid-sentence updates) is slated for v2.
- **Billing.** We store a Stripe meter ID in env and use `stripe.billing.meterEvents.create()` for overage. Included base minutes are enforced at the app layer — we only charge Stripe for overage usage through the metered price, keeping the Stripe side simple.
- **Trial enforcement.** Free users have a single `trial_seconds_used` counter on `users`. The `/api/usage` webhook caps events at remaining trial seconds and rejects further events with 402.
- **Listener page is unauthenticated.** Anyone with the QR/link can listen. No account, no download.

## v2 backlog

- Voice cloning from a 30-second speaker sample (via Cartesia custom voices)
- Multi-tenant orgs (teams, roles, org-scoped usage)
- OBS / RTMP ingest (speak from a broadcasting studio, not just a phone)
- Partial-token TTS streaming for sub-400 ms latency
- Mid-event language add/remove without disconnecting listeners
- Live transcript export + SRT/VTT caption file download
- Public API (programmatic session creation, webhooks)
- SSO / SCIM (Enterprise)

---

## Troubleshooting

**"Stripe price not configured" on checkout** — Run `pnpm stripe:setup` and paste the resulting `STRIPE_PRICE_*` values into your env.

**"LiveKit is not configured" on session start** — Confirm `LIVEKIT_URL` starts with `wss://`, `LIVEKIT_API_KEY` starts with `API`, and `NEXT_PUBLIC_LIVEKIT_URL` is set.

**Clerk webhook returns 400** — Make sure the Clerk webhook URL points to `/api/clerk/webhook`, the signing secret matches `CLERK_WEBHOOK_SECRET`, and you've subscribed to `user.created`, `user.updated`, and `user.deleted`.

**Listener hears silence** — The web app can deploy without the worker for demo purposes, but real translation requires the worker to be running and connected to the same LiveKit cluster.

---

## License

Private. All rights reserved.
