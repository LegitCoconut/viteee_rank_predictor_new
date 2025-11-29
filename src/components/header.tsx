import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

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
        <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/syllabus">Syllabus</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/mocktest">Mock Test</Link>
            </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
