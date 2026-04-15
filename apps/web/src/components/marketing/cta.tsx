import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-10 sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl"
          />
          <div className="relative flex flex-col items-center text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Your next multilingual audience is{' '}
              <span className="gradient-text">one QR code away.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              Create a session in under 30 seconds. Ten minutes of translation on the house. No card,
              no sales call, no contract.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="xl" variant="gradient" asChild>
                <Link href="/sign-up">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
