'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CYCLE_WORDS = [
  { word: 'churches', flag: '⛪' },
  { word: 'conferences', flag: '🎤' },
  { word: 'sports', flag: '⚽' },
  { word: 'lectures', flag: '🎓' },
  { word: 'keynotes', flag: '💡' },
  { word: 'town halls', flag: '🏛️' },
];

export function Hero() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CYCLE_WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const current = CYCLE_WORDS[index]!;

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_50%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[50rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.35)_0%,hsl(270_91%_65%/0.15)_40%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[20%] top-[10%] h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[15%] top-[20%] h-72 w-72 rounded-full bg-purple-500/30 blur-3xl animate-float [animation-delay:1.5s]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge variant="gradient" className="mb-6 gap-1.5 px-4 py-1.5 text-xs">
            <Sparkles className="h-3 w-3" />
            Powered by Gladia Solaria-1 + Gemini 2.5 + Cartesia Sonic-3
          </Badge>

          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Live translation for{' '}
            <span className="relative inline-block min-w-[6ch] align-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.word}
                  initial={{ opacity: 0, y: 24, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -24, rotateX: 20 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-block gradient-text"
                >
                  <span className="mr-2">{current.flag}</span>
                  {current.word}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Your speaker talks. Your audience scans a QR code, picks their language, and hears every
            word in their own voice — in under a second. No app. No installs. 100+ languages.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="xl" variant="gradient" asChild>
              <Link href="/sign-up">
                Start for free — 10 minutes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#how-it-works">
                <Play className="h-4 w-4" />
                See how it works
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              No card required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Unlimited listeners
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sub-second latency
            </span>
          </div>
        </div>

        {/* Device mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="ml-4 flex-1 truncate text-xs text-muted-foreground">
                lingora.app/listen/SUNDAY-SVC
              </div>
            </div>
            <div className="grid gap-6 p-8 sm:grid-cols-2 sm:p-10">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Now speaking
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-3 w-3">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500" />
                    <span className="absolute inset-0 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-lg font-semibold">Pastor Emmanuel Ade</span>
                </div>
                <div className="mt-6 rounded-xl border border-border bg-background/60 p-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Listening in
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xl font-semibold">
                    🇪🇸 Español
                  </div>
                  <p className="mt-4 text-balance text-foreground">
                    "Bienvenidos a la casa del Señor esta mañana. Abramos nuestros corazones..."
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="inline-block h-1 w-1.5 animate-pulse rounded-full bg-primary"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Audience
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[
                    ['🇪🇸', 'Spanish', 142],
                    ['🇫🇷', 'French', 87],
                    ['🇨🇳', 'Mandarin', 64],
                    ['🇵🇹', 'Portuguese', 53],
                    ['🇰🇷', 'Korean', 41],
                    ['🇸🇦', 'Arabic', 38],
                  ].map(([flag, label, count]) => (
                    <div
                      key={label as string}
                      className="rounded-lg border border-border bg-background/60 px-3 py-2.5"
                    >
                      <div className="text-lg">{flag as string}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{label as string}</div>
                      <div className="font-mono text-xs font-semibold">{count as number}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">425 listeners</span>{' '}
                  live across 6 languages
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo strip */}
        <div className="mt-20 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by multilingual communities worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {['Hillside Church', 'TEDx Nairobi', 'MIT Global', 'UEFA Live', 'UN Forum', 'Stripe Sessions'].map(
              (name) => (
                <span key={name} className="text-sm font-semibold tracking-tight text-muted-foreground">
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
