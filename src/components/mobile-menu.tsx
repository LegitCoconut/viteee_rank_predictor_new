'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LINKS = [
  { href: '/mocktest', label: 'Mock Tests' },
  { href: '/ranks', label: 'Rank Predictor' },
  { href: '/mocktest#leaderboard', label: 'Leaderboard' },
  { href: '/writeups', label: 'Write-ups' },
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
      <SheetContent side="right" className="flex w-[85%] max-w-xs flex-col overflow-hidden border-l border-white/25 bg-linear-to-b from-[#0a3bd0] via-[#3b4fe0] to-[#8f4dd0] p-6 text-white">
        <img
          src="/images/clouds/cloud-1.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-16 w-72 max-w-none opacity-90"
        />
        <SheetTitle className="relative text-lg font-semibold text-white">Menu</SheetTitle>
        <nav className="relative mt-4 flex flex-col divide-y divide-white/25">
          {LINKS.map((l) => (
            <SheetClose asChild key={l.href}>
              <Link href={l.href} className="flex h-12 items-center text-base font-medium text-white/90 hover:text-white">
                {l.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" className="relative mt-auto w-full bg-[#fdeef6] text-[#181121] hover:bg-white">
            <Link href="/donate">Support us</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
