import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { MobileMenu } from './mobile-menu';

const navLink = 'px-3 text-muted-foreground hover:bg-transparent hover:text-foreground';

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 w-full border-x-0 border-t-0">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-base font-semibold tracking-tight text-foreground sm:text-lg">VIT RANKS</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 sm:flex sm:gap-2">
          <Button variant="ghost" size="sm" asChild className={navLink}>
            <Link href="/mocktest">Mock Tests</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className={navLink}>
            <Link href="/ranks">Rank Predictor</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className={navLink}>
            <Link href="/mocktest#leaderboard">Leaderboard</Link>
          </Button>
          <Button size="sm" asChild className="ml-1 h-8 gap-1.5 px-4 text-xs">
            <Link href="/donate">
              <Heart className="h-3.5 w-3.5" />
              Donate
            </Link>
          </Button>
        </nav>

        <div className="ml-auto sm:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
