'use client';

import * as React from 'react';
import { ArrowLeftRight, Pause, Play, Volume2 } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { LingoraLanguage } from '@lingora/shared/languages';
import { cn } from '@/lib/utils';

interface PlayerViewProps {
  roomCode: string;
  sessionName: string;
  speakerName: string | null;
  language: LingoraLanguage;
  availableLanguages: LingoraLanguage[];
  onChangeLanguage: (lang: LingoraLanguage) => void;
}

const DEMO_CAPTIONS = [
  'Welcome, everyone. It means so much to see you here today.',
  'Let us begin by acknowledging the gift of time, and of one another.',
  'Today, we want to talk about patience — about the long arc of change.',
  'Every journey worth taking starts with a single, imperfect step.',
  'So as we settle in, let me ask: what would you begin today if you knew you could not fail?',
];

export function PlayerView({
  roomCode,
  sessionName,
  speakerName,
  language,
  availableLanguages,
  onChangeLanguage,
}: PlayerViewProps) {
  const [playing, setPlaying] = React.useState(true);
  const [captionIndex, setCaptionIndex] = React.useState(0);
  const [switchOpen, setSwitchOpen] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCaptionIndex((i) => (i + 1) % DEMO_CAPTIONS.length);
    }, 4200);
    return () => clearInterval(id);
  }, [playing]);

  const caption = DEMO_CAPTIONS[captionIndex]!;

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          playing ? 'opacity-100' : 'opacity-40',
        )}
      >
        <div className="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.35)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-[20%] top-[60%] h-96 w-96 rounded-full bg-purple-500/25 blur-3xl animate-float" />
        <div className="absolute right-[15%] top-[15%] h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-float [animation-delay:2s]" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col px-4 pt-8 pb-6 sm:px-6">
        <header className="flex items-center justify-between">
          <BrandLogo />
          <Badge variant="outline" className="font-mono text-[10px]">
            Room {roomCode}
          </Badge>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 py-6 text-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Now listening in
            </div>
            <div className="mt-2 flex items-center justify-center gap-3 text-3xl font-bold">
              <span className="text-4xl">{language.flag}</span>
              <span>{language.nativeName}</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{language.englishName}</div>
          </div>

          {/* Animated speaker orb */}
          <div className="relative my-2 flex h-48 w-48 items-center justify-center">
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
                playing && 'animate-pulse',
              )}
            />
            <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
              <Volume2
                className={cn(
                  'h-10 w-10 text-primary transition-transform',
                  playing && 'animate-pulse',
                )}
              />
            </div>
            {playing && (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
                <div className="absolute -inset-4 animate-ping rounded-full bg-primary/10 [animation-delay:300ms]" />
              </>
            )}
          </div>

          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur">
              <div className="mb-3 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live caption
              </div>
              <p className="text-balance text-xl font-medium leading-relaxed">{caption}</p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {sessionName}
            {speakerName ? ` · ${speakerName}` : ''}
          </div>
        </main>

        <footer className="mx-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-full border border-border bg-card/80 p-2 shadow-xl backdrop-blur">
          <Dialog open={switchOpen} onOpenChange={setSwitchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                <ArrowLeftRight className="h-4 w-4" />
                Change
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80svh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Pick a language</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChangeLanguage(lang);
                      setSwitchOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left',
                      lang.code === language.code && 'border-primary bg-primary/10',
                    )}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{lang.nativeName}</div>
                      <div className="text-xs text-muted-foreground">{lang.englishName}</div>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="gradient"
            size="lg"
            onClick={() => setPlaying((p) => !p)}
            className="h-12 w-12 rounded-full p-0"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 rounded-full">
            <Volume2 className="h-4 w-4" />
            Volume
          </Button>
        </footer>
      </div>
    </div>
  );
}
