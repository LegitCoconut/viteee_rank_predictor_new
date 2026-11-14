import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Sky } from '@/components/ui/animated-hero';
import { WriteupFaq, faqSchema } from '@/components/writeup-faq';
import { getWriteups, type Faq } from '@/lib/writeups';

const SITE = 'https://ranks.vhome.co.in';
const TITLE = 'VITEEE Write-ups & Guides: Dates, Eligibility';
const DESCRIPTION =
  'Plain-English VITEEE 2027 guides: dates, eligibility, exam pattern, negative marking and counselling rules, checked against the official site.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'viteee guide', 'viteee 2027 guide', 'viteee 2027 dates', 'viteee eligibility',
    'viteee exam pattern', 'viteee negative marking', 'viteee application fee',
    'viteee counselling rules', 'vit b.tech admission 2027', 'viteee preparation',
  ],
  alternates: { canonical: '/writeups' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: '/writeups',
    images: [{ url: '/hompage.png', width: 1200, height: 630, alt: 'VITEEE write-ups and guides - VIT RANKS' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/hompage.png'] },
};

const FAQ: Faq[] = [
  {
    q: 'What are these VITEEE write-ups?',
    a: 'Short, plain-English guides on VITEEE: key dates, eligibility, exam pattern and marking, fee and counselling rules, and common mistakes. Each one is cross-checked against the official VITEEE website, and anything that is our own arithmetic or opinion is labelled as such.',
  },
  {
    q: 'Are the write-ups official?',
    a: 'No. VIT RANKS is an independent, student-built platform and is not affiliated with VIT. Dates and rules can change, so always confirm them on viteee.vit.ac.in before you act.',
  },
  {
    q: 'How often are new write-ups added?',
    a: 'We add them regularly as the VITEEE 2027 cycle moves along. This page lists them newest first.',
  },
  {
    q: 'Can I check which VIT campus and branch my rank can get?',
    a: 'Yes. Use the free [VIT RANKS rank predictor](/ranks). Its data was collected from the internet using AI for 2025 and 2026, so take it with a pinch of salt.',
  },
  {
    q: 'Can I practise the real VITEEE 2027 paper pattern?',
    a: 'Yes. VIT RANKS has [free full-length mock tests](/mocktest) in the 2027 pattern (100 questions, 2 hours, per-section timers) with instant analytics and a live leaderboard. No signup is needed.',
  },
];

export default function WriteupsPage() {
  const writeups = getWriteups();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE}/writeups#page`,
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE}/writeups`,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'VIT RANKS', url: SITE },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: writeups.map((w, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE}/writeups/${w.slug}`,
            name: w.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Write-ups', item: `${SITE}/writeups` },
        ],
      },
      faqSchema(FAQ),
    ],
  };
  return (
    <div className="sky-page relative isolate flex min-h-dvh flex-col">
      <Sky />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white">Home</Link> / <span className="text-white">Write-ups</span>
          </nav>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight md:text-6xl">VITEEE write-ups</h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
            Guides on VITEEE 2027 dates, eligibility, exam pattern, negative marking and counselling rules, checked
            against the official site.
          </p>
          <ul className="mt-12 space-y-4">
            {writeups.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/writeups/${w.slug}`}
                  className="group block rounded-3xl border border-border/60 bg-card p-6 transition-colors hover:border-white/60 md:p-8"
                >
                  <p className="text-sm text-muted-foreground">
                    {w.byline || 'Write-up'} · {w.minutes} min read
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{w.title}</h2>
                  <p className="mt-3 text-muted-foreground">{w.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    Read write-up
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <WriteupFaq items={FAQ} title="About these write-ups" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
