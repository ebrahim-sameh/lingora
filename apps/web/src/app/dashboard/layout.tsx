import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Home, PlusCircle, Radio, CreditCard, Settings } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getOrCreateDbUser } from '@/lib/auth';
import { getPlanByTier } from '@lingora/shared/pricing';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/sessions/new', label: 'New session', icon: PlusCircle },
  { href: '/dashboard/sessions', label: 'Sessions', icon: Radio },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getOrCreateDbUser();
  const plan = getPlanByTier(user.planTier);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card/50 lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-border px-6">
            <BrandLogo href="/dashboard" />
          </div>
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-4">
            <div className="rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Plan
                </span>
                <Badge variant="gradient">{plan?.name ?? 'Free'}</Badge>
              </div>
              <Link
                href="/dashboard/billing"
                className="mt-3 block text-xs text-muted-foreground hover:text-foreground"
              >
                Manage subscription →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
            <div className="lg:hidden">
              <BrandLogo href="/dashboard" />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
