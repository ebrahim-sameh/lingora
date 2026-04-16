# Deploying Lingora

Lingora has two deploy surfaces: the Next.js web app (Vercel) and the
long-lived Node worker (any host that runs containers or Node 20+).

## 1. Provision credentials

Follow `README.md` → *Getting the API keys*. Grab working credentials for:

- Clerk, Neon, Stripe (test mode), LiveKit Cloud, Gladia, Google AI Studio, Cartesia

Copy `.env.example` → `apps/web/.env.local` and fill every line.

## 2. Push the database schema

```bash
pnpm db:push
```

This runs `drizzle-kit push` against your Neon database using the
`DATABASE_URL` from `apps/web/.env.local`. You should see it create
the `users`, `sessions`, `session_languages`, and `usage_events` tables.

## 3. Create Stripe products + the metered meter

```bash
pnpm stripe:setup
```

Idempotent — safe to re-run. It creates:

- Product/price for **Starter** ($29/mo) with metered overage at $0.40/min
- Product/price for **Growth** ($99/mo) with metered overage at $0.30/min
- Product/price for **Pro** ($299/mo) with metered overage at $0.20/min
- A billing meter named `speaking_minutes`

At the end it prints the `STRIPE_PRICE_*` and `STRIPE_METER_ID` env vars
you should paste into `apps/web/.env.local` and your Vercel env vars.

## 4. Deploy the web app to Vercel

```bash
# One-time (from the repo root)
pnpm dlx vercel login
pnpm dlx vercel link --yes
pnpm dlx vercel env pull apps/web/.env.production.local --environment=production

# Ship it
pnpm dlx vercel --prod
```

When `vercel link` asks:
- **Set up & deploy?** → yes
- **Which scope?** → your personal account
- **Link to existing?** → no (the project doesn't exist yet)
- **What's your project's name?** → `lingora`
- **In which directory is your code located?** → `./` (the monorepo root)
- Vercel picks up `vercel.json` and uses `pnpm turbo build --filter=@lingora/web`

After the first deploy, copy every variable from `apps/web/.env.local`
(except any `http://localhost` values — set `NEXT_PUBLIC_APP_URL` to the
Vercel production URL) into **Settings → Environment Variables** on the
Vercel dashboard, then redeploy once so everything is wired up.

## 5. Point webhooks at Vercel

- **Stripe**: Dashboard → Webhooks → Add endpoint →
  `https://your-lingora.vercel.app/api/stripe/webhook` with events
  `checkout.session.completed`, `customer.subscription.*`,
  `invoice.payment_failed`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
- **Clerk**: Dashboard → Webhooks → New endpoint →
  `https://your-lingora.vercel.app/api/clerk/webhook` with events
  `user.created`, `user.updated`, `user.deleted`. Copy the signing
  secret to `CLERK_WEBHOOK_SECRET`.

## 6. Deploy the worker

The worker **does not run on Vercel** — it holds long-lived WebSocket
connections and needs a regular Node host.

**Railway (fastest):**

1. `railway init` at the repo root (or use the dashboard)
2. Point the service at `apps/worker` and set the build command:
   `pnpm install --ignore-scripts && pnpm --filter @lingora/worker build`
   and start command: `pnpm --filter @lingora/worker start`
3. Copy the `LIVEKIT_*`, `GLADIA_API_KEY`, `GEMINI_API_KEY`,
   `CARTESIA_API_KEY`, `WORKER_USAGE_WEBHOOK_URL`, `WORKER_USAGE_SECRET`
   env vars into Railway's environment settings.
4. Deploy.

**Fly.io (with the provided Dockerfile):**

```bash
fly launch --dockerfile apps/worker/Dockerfile
# set secrets:
fly secrets set LIVEKIT_URL=... LIVEKIT_API_KEY=... LIVEKIT_API_SECRET=...
fly secrets set GLADIA_API_KEY=... GEMINI_API_KEY=... CARTESIA_API_KEY=...
fly secrets set WORKER_USAGE_WEBHOOK_URL=https://your-lingora.vercel.app/api/usage
fly secrets set WORKER_USAGE_SECRET=...
fly deploy
```

A single 512 MB instance handles dozens of concurrent rooms. Scale
horizontally for more — the worker is stateless (it polls LiveKit
RoomService every 5 seconds and claims any lingora-* room it doesn't yet own).

## 7. Smoke test

- Visit `https://your-lingora.vercel.app/` — landing page with word-cycling hero.
- `/pricing` — 5-tier pricing with Growth highlighted.
- Sign up via `/sign-up`, land on `/dashboard`.
- Create a session, grab the QR code, open `/listen/<room>` on a phone.
- Pick a language, wait for "Listening in …" to appear.
- Speak into the dashboard's mic button. The listener should hear you
  translated within a second (assuming the worker is running).

If the listener hears silence, check the worker logs — most issues are
missing env vars or a mismatch between `WORKER_USAGE_WEBHOOK_URL` and
the actual Vercel URL.
