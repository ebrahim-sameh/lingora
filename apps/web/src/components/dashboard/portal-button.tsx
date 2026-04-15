'use client';

import * as React from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PortalButton({ className }: { className?: string }) {
  const [loading, setLoading] = React.useState(false);
  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Failed to open portal');
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open portal');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      variant="gradient"
      onClick={openPortal}
      disabled={loading}
      className={cn(className)}
    >
      <CreditCard className="h-4 w-4" />
      {loading ? 'Opening…' : 'Manage subscription'}
    </Button>
  );
}
