import { MicVocal, QrCode, Languages } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: MicVocal,
    title: 'Speaker starts a session',
    description:
      "Pick your target languages, tap Start. Lingora spins up a LiveKit room and a translation pipeline for each language in under two seconds.",
    tone: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
  },
  {
    step: '02',
    icon: QrCode,
    title: 'Audience scans the QR',
    description:
      'A big QR code appears on your projector. Listeners scan, pick their language on a beautiful mobile picker, and tap Listen. No app, no account, no download.',
    tone: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  },
  {
    step: '03',
    icon: Languages,
    title: 'Everyone hears their language',
    description:
      "You speak. Your audience hears you in theirs — translated, spoken naturally, and streamed through their phone in real-time. Captions follow along in sync.",
    tone: 'from-pink-500/20 to-pink-600/5 border-pink-500/30',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How Lingora works
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps to a multilingual room.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            From "I need to translate this sermon" to "it's live" takes about 90 seconds on any laptop
            or phone.
          </p>
        </div>

        <div className="relative mt-16 grid gap-6 lg:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="absolute top-[72px] left-[16%] right-[16%] hidden h-px bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 lg:block"
          />
          {steps.map((s) => (
            <div
              key={s.step}
              className={`relative rounded-2xl border bg-gradient-to-b ${s.tone} p-8`}
            >
              <div className="flex items-start justify-between">
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground">
                  {s.step}
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
