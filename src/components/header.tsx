import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 w-full border-x-0 border-t-0">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="VITEEE Ranks Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-foreground hidden md:block">
            VITEEE Ranks
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="px-2 text-muted-foreground hover:bg-transparent hover:text-foreground sm:px-3">
            <Link href="/mocktest">Mock Tests</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="px-2 text-muted-foreground hover:bg-transparent hover:text-foreground sm:px-3">
            <Link href="/ranks">Rank Predictor</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden px-2 text-muted-foreground hover:bg-transparent hover:text-foreground sm:inline-flex sm:px-3">
            <Link href="/mocktest#leaderboard">Leaderboard</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="ml-1 h-8 gap-1.5 px-3 text-xs sm:px-4"
          >
            <Link href="/donate">
              <Heart className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Donate</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
