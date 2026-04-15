'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <BrandLogo />
        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">Something went sideways</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          A live translation service should never drop a word. We'll fix it — try again in a moment.
        </p>
        {error.message && (
          <pre className="mx-auto mt-6 max-w-md overflow-auto rounded-xl border border-border bg-card p-4 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="gradient" onClick={reset}>
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
