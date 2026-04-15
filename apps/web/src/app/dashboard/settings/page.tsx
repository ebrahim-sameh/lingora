import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrCreateDbUser } from '@/lib/auth';

export default async function SettingsPage() {
  const user = await getOrCreateDbUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Profile, API access, and notifications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Managed by Clerk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Name" value={user.name ?? '—'} />
          <Field label="Email" value={user.email} />
          <Field label="Plan" value={user.planTier} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API access</CardTitle>
          <CardDescription>
            Programmatic session creation and webhooks. <Badge variant="outline">Coming in v2</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            We're baking the public API right now. Pro and Enterprise plans get first access — ping{' '}
            <a
              href="mailto:api@lingora.app"
              className="font-semibold text-foreground underline underline-offset-2"
            >
              api@lingora.app
            </a>{' '}
            to join the preview.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>How Lingora talks to you about sessions and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Session end summary" help="Email recap with usage and listener count." />
          <Row label="Low trial minutes" help="Warn me when I've used 80% of my trial." />
          <Row
            label="Invoice receipts"
            help="Stripe sends these; we don't duplicate them here."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Row({ label, help }: { label: string; help: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background/40 p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{help}</div>
      </div>
      <Badge variant="outline">Default</Badge>
    </div>
  );
}
