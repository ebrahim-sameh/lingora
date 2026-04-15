import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.2)_0%,transparent_60%)]"
      />
      <div className="relative">
        <BrandLogo />
        <h1 className="mt-8 text-6xl font-bold tracking-tight sm:text-7xl">404</h1>
        <h2 className="mt-2 text-2xl font-semibold">Lost in translation</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          We couldn't find that page. Maybe it was in a language we haven't learned yet.
        </p>
        <Button variant="gradient" size="lg" className="mt-8" asChild>
          <Link href="/">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
