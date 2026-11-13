import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Sky } from '@/components/ui/animated-hero';
import { WriteupBody } from '@/components/writeup-body';
import { WriteupFaq, faqSchema } from '@/components/writeup-faq';
import { getWriteup, getWriteups } from '@/lib/writeups';

const SITE = 'https://ranks.vhome.co.in';
const BASE_KEYWORDS = ['viteee 2027', 'viteee guide', 'vit b.tech admission', 'viteee preparation'];

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriteups().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = getWriteup((await params).slug);
  if (!w) return {};
  const iso = w.date?.toISOString();
  return {
    title: w.title,
    description: w.summary,
    keywords: [...BASE_KEYWORDS, ...w.headings.map((h) => `viteee ${h.text.toLowerCase()}`)],
    alternates: { canonical: `/writeups/${w.slug}` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    openGraph: {
      type: 'article',
      title: w.title,
      description: w.summary,
      url: `/writeups/${w.slug}`,
      ...(iso ? { publishedTime: iso, modifiedTime: iso } : {}),
      images: [{ url: '/hompage.png', width: 1200, height: 630, alt: w.title }],
    },
    twitter: { card: 'summary_large_image', title: w.title, description: w.summary, images: ['/hompage.png'] },
  };
}

const CTAS = [
  { href: '/ranks', title: 'Predict your VIT rank', text: 'See which campus and branch your VITEEE rank can get.' },
  { href: '/mocktest', title: 'Take a free mock test', text: '100 questions, 2 hours, the real 2027 pattern.' },
  { href: '/ranks/info', title: 'Browse the cutoff data', text: 'Closing ranks, marks-to-rank ladder and counselling rules.' },
];

export default async function WriteupPage({ params }: { params: Promise<{ slug: string }> }) {
  const w = getWriteup((await params).slug);
  if (!w) notFound();
  const others = getWriteups().filter((o) => o.slug !== w.slug);
  const url = `${SITE}/writeups/${w.slug}`;
  const iso = w.date?.toISOString().slice(0, 10);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: w.title,
        description: w.summary,
        ...(iso ? { datePublished: iso, dateModified: iso } : {}),
        inLanguage: 'en',
        wordCount: w.raw.split(/\s+/).length,
        articleSection: w.headings.map((h) => h.text),
        image: `${SITE}/hompage.png`,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'VIT RANKS · Malabar Matrix', url: SITE },
        publisher: {
          '@type': 'Organization',
          name: 'VIT RANKS · Malabar Matrix',
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
        },
        about: ['VITEEE 2027', 'VIT Vellore', 'VIT Chennai', 'VIT-AP', 'VIT Bhopal'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Write-ups', item: `${SITE}/writeups` },
          { '@type': 'ListItem', position: 3, name: w.title, item: url },
        ],
      },
      ...(w.faq.length ? [faqSchema(w.faq)] : []),
    ],
  };
  return (
    <div className="sky-page relative isolate flex min-h-dvh flex-col">
      <Sky />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/writeups" className="inline-flex items-center gap-0.5 hover:text-white">
              <ChevronLeft className="h-3.5 w-3.5" />
              Write-ups
            </Link>
          </nav>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">{w.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {w.date && <time dateTime={iso}>{w.byline.split('·')[0].trim()}</time>}
            {w.date ? ' · ' : ''}
            {w.minutes} min read
          </p>

          {w.headings.length > 2 && (
            <nav aria-label="On this page" className="mt-8 rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm font-semibold">On this page</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-white/90 md:text-base">
                {w.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="underline-offset-4 hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <WriteupBody markdown={w.body} />
          <WriteupFaq items={w.faq} />

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Keep going</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {CTAS.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-white/60"
                >
                  <p className="font-semibold">{c.title}</p>
                  <p className="mt-1.5 text-sm text-white/85">{c.text}</p>
                  <ArrowRight className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>

          {others.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">More write-ups</h2>
              <ul className="mt-4 space-y-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/writeups/${o.slug}`} className="font-medium underline underline-offset-4">
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
