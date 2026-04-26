import Image from 'next/image';
import Link from 'next/link';
import { Heart, Mail, ExternalLink } from 'lucide-react';

const NAV_LINKS = {
  Platform: [
    { label: 'Mock Tests', href: '/mocktest' },
    { label: 'Leaderboard', href: '/mocktest#leaderboard' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Exam UI preview', href: '/#exam-ui' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Donate', href: '/donate' },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border/50 bg-card/30">
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--coral)) 50%, transparent 100%)',
        }}
      />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.06]" />

      <div className="container relative mx-auto px-4 py-12">
        {/* Main grid */}
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image
                src="/logo.png"
                alt="VITEEE Ranks Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-headline text-lg font-bold tracking-tight text-foreground">
                VITEEE Ranks
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free, full-length VITEEE mock tests with instant analytics, a live
              leaderboard, and the complete syllabus. No signup. No paywall.
            </p>

            <a
              href="mailto:vitranks@malabarmatrix.site"
              className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              vitranks@malabarmatrix.site
            </a>

            <Link
              href="/donate"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3 py-1.5 text-xs font-medium text-coral transition-colors hover:bg-coral/20"
            >
              <Heart className="h-3 w-3" />
              Support the project
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(NAV_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground/60 sm:flex-row">
          <p>&copy; 2025 Malabar Matrix. All rights reserved.</p>

          <a
            href="https://vhome.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-muted-foreground"
          >
            In association with vhome.co.in
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
