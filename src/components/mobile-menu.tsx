'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LINKS = [
  { href: '/mocktest', label: 'Mock Tests' },
  { href: '/ranks', label: 'Rank Predictor' },
  { href: '/mocktest#leaderboard', label: 'Leaderboard' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/terms', label: 'Terms & Conditions' },
];

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[85%] max-w-xs flex-col p-6">
        <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        <nav className="mt-4 flex flex-col divide-y divide-border">
          {LINKS.map((l) => (
            <SheetClose asChild key={l.href}>
              <Link href={l.href} className="flex h-12 items-center text-base text-foreground/90 hover:text-foreground">
                {l.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" className="mt-auto w-full">
            <Link href="/donate">Support us</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
