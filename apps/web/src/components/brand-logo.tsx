import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BrandLogo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 group', className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_-4px_hsl(270_91%_65%/0.6)] transition-all group-hover:shadow-[0_0_24px_-2px_hsl(270_91%_65%/0.8)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C9.79086 2 8 3.79086 8 6V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V6C16 3.79086 14.2091 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M19 11V12C19 15.866 15.866 19 12 19M12 19C8.13401 19 5 15.866 5 12V11M12 19V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xl font-semibold tracking-tight">Lingora</span>
    </Link>
  );
}
