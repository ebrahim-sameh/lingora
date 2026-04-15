import {
  Zap,
  Globe2,
  MicVocal,
  QrCode,
  Infinity as InfinityIcon,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Sub-second latency',
    description:
      'From microphone to eardrum in under 800 ms. Gladia Solaria-1 streams partials, Gemini 2.5 Flash translates in real-time, Cartesia Sonic-3 speaks before the speaker finishes their sentence.',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Globe2,
    title: '100+ languages out of the box',
    description:
      "From Arabic to Zulu, Mandarin to Māori. Every dialect Gladia supports, every voice Cartesia has trained. Pick what you need — add more on the fly mid-event without stopping.",
    accent: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: InfinityIcon,
    title: 'Unlimited listeners per room',
    description:
      'One speaker, one QR code, one LiveKit room. 10 listeners or 10,000 — your cost stays the same. You only pay for speaking minutes, never for audience size.',
    accent: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: QrCode,
    title: 'Zero install for your audience',
    description:
      'Listeners scan, pick their language, tap "Listen." No App Store, no signup, no downloads. Works on any phone built after 2018 in any modern browser.',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: MicVocal,
    title: 'Natural voice, not robotic',
    description:
      'Sonic-3 produces warm, emotive speech that matches the register of a preacher, a professor, or a play-by-play announcer. v2 will let you clone the speaker\'s own voice.',
    accent: 'from-rose-500/20 to-red-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: ShieldCheck,
    title: 'Built for live, built to scale',
    description:
      'WebRTC fan-out via LiveKit Cloud handles 10,000+ simultaneous listeners in a single room. Graceful reconnects, language hot-swap, and resilient audio at the edge.',
    accent: 'from-cyan-500/20 to-sky-500/20',
    iconColor: 'text-cyan-400',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Everything live events need
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            A live interpreter crew, compressed into a link.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Six pillars that make the difference between "a translation gadget" and a service your
            multilingual audience will actually use on a Sunday morning.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-10px_hsl(239_84%_67%/0.4)]"
            >
              <div
                className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br ${f.accent} blur-3xl opacity-60 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background ${f.iconColor}`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
