'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy,
  ExternalLink,
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  Users2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Session } from '@lingora/db';
import type { LingoraLanguage } from '@lingora/shared/languages';
import { formatMinutes } from '@/lib/utils';

interface ActiveSessionViewProps {
  session: Session;
  languages: LingoraLanguage[];
}

export function ActiveSessionView({ session, languages }: ActiveSessionViewProps) {
  const [micOn, setMicOn] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [level, setLevel] = React.useState(0);
  const [transcript, setTranscript] = React.useState('');

  React.useEffect(() => {
    if (!micOn) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [micOn]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setLevel((l) => {
        if (!micOn) return Math.max(0, l * 0.85);
        const delta = (Math.random() - 0.5) * 40;
        return Math.max(5, Math.min(95, l + delta));
      });
    }, 120);
    return () => clearInterval(id);
  }, [micOn]);

  const listenerBase =
    typeof window === 'undefined'
      ? `https://lingora.app/listen/${session.roomCode}`
      : `${window.location.origin}/listen/${session.roomCode}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(listenerBase);
      toast.success('Listener link copied');
    } catch {
      toast.error('Could not copy link');
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
            <Badge variant={micOn ? 'success' : 'outline'}>{micOn ? 'LIVE' : 'Ready'}</Badge>
          </div>
          {session.speakerName && (
            <p className="mt-1 text-muted-foreground">Speaker: {session.speakerName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyLink}>
            <Copy className="h-4 w-4" /> Copy listener link
          </Button>
          <Button variant="outline" asChild>
            <a href={`/listen/${session.roomCode}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> Open listener
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
            <CardHeader>
              <CardTitle>Speaker controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  size="xl"
                  variant={micOn ? 'destructive' : 'gradient'}
                  onClick={() => setMicOn((v) => !v)}
                  className="h-16 w-16 rounded-full p-0"
                >
                  {micOn ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {micOn ? 'Broadcasting' : 'Tap to go live'}
                  </div>
                  <div className="font-mono text-2xl font-semibold">{formatMinutes(elapsed)}</div>
                </div>
                <div className="ml-auto flex items-end gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const barHeight = Math.max(
                      6,
                      Math.min(48, level - Math.abs(i - 12) * 2.2),
                    );
                    return (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-500 transition-all"
                        style={{ height: `${barHeight}px` }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live transcript
                </div>
                <p className="min-h-[3rem] text-base leading-relaxed">
                  {micOn
                    ? transcript ||
                      'Waiting for audio… once you start speaking, your words will appear here in real-time.'
                    : 'Transcript appears here once the session starts.'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" disabled={!micOn}>
                  <Pause className="h-4 w-4" /> Pause
                </Button>
                <Button variant="outline" disabled={!micOn}>
                  <Play className="h-4 w-4" /> Resume
                </Button>
                <Button variant="destructive" disabled={!micOn} onClick={() => setMicOn(false)}>
                  <Square className="h-4 w-4" /> End session
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Audience QR</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-white p-4 shadow-xl">
              <QRCodeSVG value={listenerBase} size={220} level="H" includeMargin={false} />
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Join at
              </div>
              <div className="font-mono text-sm">
                {listenerBase.replace(/^https?:\/\//, '')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Room code
              </div>
              <div className="font-mono text-3xl font-bold tracking-widest">{session.roomCode}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Languages live</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users2 className="h-4 w-4" />
              <span className="font-mono">0 listeners</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{lang.flag}</span>
                  <Badge variant="outline">
                    <span className="font-mono">0</span>
                  </Badge>
                </div>
                <div className="mt-3 font-semibold">{lang.englishName}</div>
                <div className="text-xs text-muted-foreground">{lang.nativeName}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
