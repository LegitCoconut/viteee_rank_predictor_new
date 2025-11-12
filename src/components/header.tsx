import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight text-foreground">
            VITEEE Ranks
          </span>
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
