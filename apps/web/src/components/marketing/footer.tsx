import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

const groups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Languages', href: '/#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:hello@lingora.app' },
      { label: 'Careers', href: '/careers' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'DPA', href: '/dpa' },
      { label: 'Security', href: '/security' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Real-time AI live translation for any multilingual event. Speak once. Heard everywhere.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {group.title}
              </div>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lingora, Inc. Speak once. Heard everywhere.
          </p>
          <p className="text-xs text-muted-foreground">
            Built on LiveKit · Gladia Solaria-1 · Gemini 2.5 Flash · Cartesia Sonic-3
          </p>
        </div>
      </div>
    </footer>
  );
}
