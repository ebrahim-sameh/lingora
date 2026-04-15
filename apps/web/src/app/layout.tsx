import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://lingora.vercel.app'),
  title: {
    default: 'Lingora — Speak once. Heard everywhere.',
    template: '%s · Lingora',
  },
  description:
    'Real-time AI live translation for churches, conferences, sports, lectures, and every live multilingual event. Unlimited listeners, 100+ languages, sub-second latency, no app install.',
  keywords: [
    'live translation',
    'AI interpreter',
    'real-time translation',
    'event translation',
    'church translation',
    'conference translation',
    'Lingora',
  ],
  authors: [{ name: 'Lingora' }],
  openGraph: {
    type: 'website',
    title: 'Lingora — Speak once. Heard everywhere.',
    description:
      'Real-time AI live translation for any live event. 100+ languages, unlimited listeners, sub-second latency.',
    siteName: 'Lingora',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lingora — Speak once. Heard everywhere.',
    description: 'Real-time AI live translation for any live event.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#6366f1',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="font-sans min-h-screen bg-background">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
