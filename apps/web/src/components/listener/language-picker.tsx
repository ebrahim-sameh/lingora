'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  LANGUAGE_REGIONS,
  type LingoraLanguage,
  type LanguageRegion,
} from '@lingora/shared/languages';

interface LanguagePickerProps {
  roomCode: string;
  sessionName: string;
  speakerName: string | null;
  languages: LingoraLanguage[];
  onSelect: (lang: LingoraLanguage) => void;
}

export function LanguagePicker({
  roomCode,
  sessionName,
  speakerName,
  languages,
  onSelect,
}: LanguagePickerProps) {
  const [search, setSearch] = React.useState('');

  const grouped = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = {} as Record<LanguageRegion, LingoraLanguage[]>;
    for (const region of LANGUAGE_REGIONS) result[region] = [];
    for (const lang of languages) {
      if (
        !q ||
        lang.englishName.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
      ) {
        result[lang.region].push(lang);
      }
    }
    return result;
  }, [languages, search]);

  return (
    <div className="relative min-h-[100svh] bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,hsl(239_84%_67%/0.3)_0%,hsl(270_91%_65%/0.15)_40%,transparent_70%)]"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-2xl flex-col px-4 pb-8 pt-10 sm:px-6 sm:pt-16">
        <div className="flex items-center justify-between">
          <BrandLogo />
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Room {roomCode}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500" />
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
            </span>
            Live now
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {sessionName}
          </h1>
          {speakerName && (
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              with {speakerName}
            </p>
          )}
          <p className="mx-auto mt-6 max-w-sm text-balance text-base text-muted-foreground sm:text-lg">
            Pick your language. You'll hear the speaker translated in real-time.
          </p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your language…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 rounded-2xl border-border/60 bg-card/80 pl-12 text-base shadow-lg"
            />
          </div>
        </div>

        <ScrollArea className="mt-6 flex-1 rounded-2xl">
          <div className="space-y-5">
            {LANGUAGE_REGIONS.map((region) => {
              const items = grouped[region];
              if (!items || items.length === 0) return null;
              return (
                <div key={region}>
                  <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />
                    <span>{region}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-2">
                    {items.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => onSelect(lang)}
                        className={cn(
                          'group flex items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 text-left transition-all active:scale-[0.98]',
                          'hover:border-primary/50 hover:bg-card hover:shadow-[0_0_40px_-10px_hsl(239_84%_67%/0.6)]',
                        )}
                      >
                        <span className="text-3xl">{lang.flag}</span>
                        <span className="min-w-0 flex-1">
                          <div className="truncate text-lg font-semibold">{lang.nativeName}</div>
                          <div className="truncate text-sm text-muted-foreground">
                            {lang.englishName}
                          </div>
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.values(grouped).every((arr) => arr.length === 0) && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No languages match "{search}". Try a native name like <em>Español</em> or{' '}
                  <em>العربية</em>.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Powered by{' '}
          <Link href="/" className="font-semibold text-foreground underline underline-offset-2">
            Lingora
          </Link>{' '}
          · No app, no account, zero install
        </div>
      </div>
    </div>
  );
}
