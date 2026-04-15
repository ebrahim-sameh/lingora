'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  groupLanguagesByRegion,
  LANGUAGES,
  LANGUAGE_REGIONS,
  type LingoraLanguage,
  type LanguageRegion,
} from '@lingora/shared/languages';

const grouped = groupLanguagesByRegion();

export function NewSessionForm() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [speakerName, setSpeakerName] = React.useState('');
  const [speakerLanguage, setSpeakerLanguage] = React.useState('en');
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set(['es', 'fr']));
  const [submitting, setSubmitting] = React.useState(false);

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const next = {} as Record<LanguageRegion, LingoraLanguage[]>;
    for (const region of LANGUAGE_REGIONS) next[region] = [];
    for (const lang of LANGUAGES) {
      if (
        lang.englishName.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
      ) {
        next[lang.region].push(lang);
      }
    }
    return next;
  }, [search]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Give the session a name');
      return;
    }
    if (selected.size === 0) {
      toast.error('Pick at least one target language');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          speakerName: speakerName.trim() || undefined,
          speakerLanguage,
          targetLanguages: Array.from(selected),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Failed to create session');
      }
      const data = (await res.json()) as { session: { id: string } };
      toast.success('Session created');
      router.push(`/dashboard/sessions/${data.session.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Session name</Label>
            <Input
              id="name"
              placeholder="Sunday morning service — April 14"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="speaker-name">Speaker name (optional)</Label>
              <Input
                id="speaker-name"
                placeholder="Pastor Emmanuel"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="speaker-language">Spoken in</Label>
              <Select value={speakerLanguage} onValueChange={setSpeakerLanguage}>
                <SelectTrigger id="speaker-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.slice(0, 30).map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag} {l.englishName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Target languages</CardTitle>
            <Badge variant="gradient">{selected.size} selected</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search languages…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[420px] rounded-lg border border-border bg-background/40">
            <div className="divide-y divide-border">
              {LANGUAGE_REGIONS.map((region) => {
                const items = filtered[region];
                if (!items || items.length === 0) return null;
                return (
                  <div key={region} className="p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {region}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {items.map((lang) => {
                        const isSelected = selected.has(lang.code);
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => toggle(lang.code)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all',
                              isSelected
                                ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_20px_-10px_hsl(239_84%_67%/0.6)]'
                                : 'border-border bg-card hover:border-primary/40',
                            )}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="min-w-0 flex-1 truncate">
                              <div className="truncate font-medium">{lang.englishName}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {lang.nativeName}
                              </div>
                            </span>
                            {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="gradient" size="lg" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create session'}
        </Button>
      </div>
    </form>
  );
}
