import Link from 'next/link';
import { ArrowRight, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrCreateDbUser } from '@/lib/auth';
import { getRecentSessions } from '@/lib/usage';
import { formatDate, formatMinutes } from '@/lib/utils';

export default async function SessionsPage() {
  const user = await getOrCreateDbUser();
  const rows = await getRecentSessions(user.id, 50);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="mt-1 text-muted-foreground">Every live translation session you've started.</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/sessions/new">
            New session <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="p-14 text-center">
            <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Nothing here yet.</h2>
            <p className="mt-2 text-muted-foreground">
              Your first session is a minute away. Pick a name and a few target languages.
            </p>
            <Button variant="gradient" className="mt-6" asChild>
              <Link href="/dashboard/sessions/new">Create a session</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/40">
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{s.roomCode}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(s.createdAt)}</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {formatMinutes(s.totalSecondsSpoken)}
                    </td>
                    <td className="px-6 py-4">
                      {s.isActive ? (
                        <Badge variant="success">Live</Badge>
                      ) : s.endedAt ? (
                        <Badge variant="secondary">Ended</Badge>
                      ) : (
                        <Badge variant="outline">Ready</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/sessions/${s.id}`}>Open</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
