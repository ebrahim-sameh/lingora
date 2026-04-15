# @lingora/worker

Long-lived Node worker that bridges the speaker's audio in a LiveKit room through Gladia → Gemini → Cartesia and republishes translated audio tracks back into the same room, one per target language.

## Why a separate app

The worker is **not** a Vercel function. It holds persistent WebSocket connections to LiveKit, Gladia, and Cartesia for the full duration of a live event. Deploy it to any long-lived Node host:

- **Railway** — one-click from the Dockerfile
- **Fly.io** — `fly launch` from the Dockerfile
- **Render / Koyeb / Northflank** — same story

## Env vars

See `.env.example` at the repo root. The worker needs:

```
LIVEKIT_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
GLADIA_API_KEY
GEMINI_API_KEY
CARTESIA_API_KEY
WORKER_USAGE_WEBHOOK_URL   # https://your-app.vercel.app/api/usage
WORKER_USAGE_SECRET        # shared secret with the web app
```

## Architecture

```
[Listener phones] ── subscribe to translation-<lang> track
        ▲
        │
[LiveKit Room: lingora-ABC123]
        ▲                                                  │
        │ publish translation-<lang> tracks                 │ speaker audio
        │                                                   ▼
       RoomBridge (bridge participant, this worker) ◄── subscribes to speaker track
        │
        ├── LanguageBridge(es) ─ Gladia → Gemini → Cartesia → AudioSource
        ├── LanguageBridge(fr) ─ Gladia → Gemini → Cartesia → AudioSource
        └── LanguageBridge(zh) ─ Gladia → Gemini → Cartesia → AudioSource
```

The worker polls LiveKit's RoomService every 5 seconds for rooms matching `lingora-*`, joins any it hasn't yet, and gracefully leaves rooms that have been closed.

## Usage reporting

Every 30 seconds the worker batches `(userId, sessionId, language, seconds)` tuples and POSTs them to `/api/usage`. The web app persists the event and forwards it to Stripe via `stripe.billing.meterEvents.create()`. Free-trial users get quota-enforced at the API layer.
