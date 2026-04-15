import Link from 'next/link';
import { ArrowRight, Clock, Radio, Users2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getOrCreateDbUser } from '@/lib/auth';
import { getRecentSessions, getUsageSummary } from '@/lib/usage';
import { getPlanByTier } from '@lingora/shared/pricing';
import { formatDate, formatMinutes } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  const usage = await getUsageSummary(user.id);
  const recent = await getRecentSessions(user.id, 5);
  const plan = getPlanByTier(user.planTier);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="mt-1 text-muted-foreground">
            Start a new session or review recent activity below.
          </p>
        </div>
        <Button size="lg" variant="gradient" asChild>
          <Link href="/dashboard/sessions/new">
            Start a session <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Usage panel */}
      <Card className="overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle>Usage this period</CardTitle>
            <Badge variant="gradient">{plan?.name ?? 'Free'}</Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold tracking-tight font-mono">
                {usage.minutesUsed}
              </span>
              <span className="text-muted-foreground"> / {usage.minutesIncluded} min</span>
            </div>
            <div className="text-sm text-muted-foreground">{usage.percentUsed}% used</div>
          </div>
          <Progress value={usage.percentUsed} />
          {usage.isTrialExhausted && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              Your free trial is exhausted.{' '}
              <Link href="/pricing" className="font-semibold underline underline-offset-2">
                Upgrade to continue.
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={Clock}
          label="Total time spoken"
          value={formatMinutes(recent.reduce((s, r) => s + r.totalSecondsSpoken, 0))}
        />
        <StatTile icon={Radio} label="Sessions created" value={recent.length.toString()} />
        <StatTile
          icon={Users2}
          label="Max languages/session"
          value={plan?.maxLanguages === 'unlimited' ? '∞' : String(plan?.maxLanguages ?? '1')}
        />
      </div>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent sessions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/sessions">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Zap className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No sessions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start your first live translation in under 30 seconds.
              </p>
              <Button variant="gradient" className="mt-6" asChild>
                <Link href="/dashboard/sessions/new">Create a session</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(s.createdAt)} · Room{' '}
                      <span className="font-mono">{s.roomCode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right text-xs text-muted-foreground sm:block">
                      {formatMinutes(s.totalSecondsSpoken)}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/sessions/${s.id}`}>Open</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold font-mono">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
