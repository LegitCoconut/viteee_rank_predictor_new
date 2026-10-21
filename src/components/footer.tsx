import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = {
  Platform: [
    { label: 'Mock Tests', href: '/mocktest' },
    { label: 'Rank Predictor', href: '/ranks' },
    { label: 'Leaderboard', href: '/mocktest#leaderboard' },
  ],
  Learn: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Exam UI preview', href: '/#exam-ui' },
    { label: 'Important dates', href: '/#important-dates' },
    { label: 'Past results', href: '/#past-results' },
  ],
  Company: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Donate', href: '/donate' },
    { label: 'Feedback', href: '/#feedback' },
    { label: 'Contact', href: 'mailto:vitranks@malabarmatrix.in' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card text-foreground">
      <div className="container mx-auto px-4 pt-16">
        <div>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 text-center sm:grid-cols-3">
            {Object.entries(NAV_LINKS).map(([group, links]) => (
              <div key={group}>
                <p className="mb-4 text-sm text-muted-foreground">{group}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/90 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p
          aria-hidden
          className="select-none whitespace-nowrap bg-gradient-to-b from-foreground/80 to-foreground/0 bg-clip-text pt-16 text-center font-headline text-[11vw] overflow-hidden font-bold leading-none tracking-tighter text-transparent"
        >
          MalabarMatrix
        </p>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="https://malabarmatrix.in/malabar_matrix.webp"
              alt="Malabar Matrix logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <p>&copy; 2026 Malabar Matrix. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:vitranks@malabarmatrix.in" className="hover:text-foreground">
              vitranks@malabarmatrix.in
            </a>
            <a
              href="https://malabarmatrix.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              malabarmatrix.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
