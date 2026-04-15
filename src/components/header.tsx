import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="VITEEE Ranks Logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-headline text-xl font-bold tracking-tight text-foreground hidden md:block">
            VITEEE Ranks
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/mocktest">Mock Test</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/mocktest#leaderboard">Leaderboard</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
