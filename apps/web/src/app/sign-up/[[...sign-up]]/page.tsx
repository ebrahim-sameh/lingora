import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { BrandLogo } from '@/components/brand-logo';

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_91%_65%/0.18)_0%,transparent_60%)]"
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <BrandLogo />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            10 minutes of live translation on the house. No card required.
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-card border border-border shadow-xl rounded-2xl',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-border',
                formFieldInput: 'bg-background border-input',
                footerActionLink: 'text-primary hover:text-primary/80',
                formButtonPrimary:
                  'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
              },
            }}
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
          />
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
