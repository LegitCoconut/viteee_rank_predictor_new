import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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
            <Link href="/mocktest">Mock Tests</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/mocktest#leaderboard">Leaderboard</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="ml-1 h-8 gap-1.5 rounded-full bg-gradient-to-r from-coral to-peach px-3 text-xs font-semibold text-plum-deep shadow-sm shadow-coral/20 hover:from-coral hover:to-peach sm:px-4"
          >
            <Link href="/donate">
              <Heart className="h-3.5 w-3.5" />
              Donate
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
