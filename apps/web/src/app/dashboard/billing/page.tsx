import Link from 'next/link';
import { ArrowRight, CreditCard, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getOrCreateDbUser } from '@/lib/auth';
import { getUsageSummary } from '@/lib/usage';
import { getPlanByTier } from '@lingora/shared/pricing';
import { PortalButton } from '@/components/dashboard/portal-button';
import { formatDate, formatMinutes } from '@/lib/utils';

export default async function BillingPage() {
  const user = await getOrCreateDbUser();
  const usage = await getUsageSummary(user.id);
  const plan = getPlanByTier(user.planTier);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & usage</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription, usage, and invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current plan</CardTitle>
            <Badge variant="gradient">{plan?.name ?? 'Free'}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Minutes used this period
              </div>
              <div className="mt-1 text-3xl font-bold font-mono">
                {usage.minutesUsed}
                <span className="text-base font-normal text-muted-foreground">
                  {' '}
                  / {usage.minutesIncluded}
                </span>
              </div>
              <Progress value={usage.percentUsed} className="mt-3" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {usage.overageSeconds > 0 ? 'Overage' : 'Current period'}
              </div>
              <div className="mt-1 text-3xl font-bold font-mono">
                {usage.overageSeconds > 0
                  ? `+${formatMinutes(usage.overageSeconds)}`
                  : user.stripeCurrentPeriodEnd
                    ? formatDate(user.stripeCurrentPeriodEnd)
                    : '—'}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {usage.overageSeconds > 0 && plan?.overagePerMinuteUsd
                  ? `Billed at $${plan.overagePerMinuteUsd.toFixed(2)}/min per language`
                  : 'Renews on the date above'}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            {user.stripeCustomerId ? (
              <PortalButton />
            ) : (
              <Button variant="gradient" asChild>
                <Link href="/pricing">
                  Upgrade plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/pricing">
                Compare plans <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {user.stripeCustomerId ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Your invoices are available in the Stripe billing portal.
              </p>
              <PortalButton className="mt-4" />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <Download className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No invoices yet. Upgrade to a paid plan to start billing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
