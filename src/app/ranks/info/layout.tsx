import type { Metadata } from 'next';
import { RanksInfoJsonLd } from '@/components/ranks-jsonld';

export const metadata: Metadata = {
  title: 'VITEEE 2025 Cutoffs, Marks vs Rank & Counselling Data',
  description:
    'Complete VITEEE 2025 cutoff data - campus-wise Category 1 to 5 closing ranks for every B.Tech programme at VIT Vellore, Chennai, AP and Bhopal. Marks-to-rank ladder, counselling eligibility rule, exam pattern, and 2027 rank-band outlook.',
  keywords: [
    // Cutoff / data
    'viteee cutoff', 'viteee 2025 cutoff', 'viteee cutoff 2027',
    'vit cutoff', 'vit cutoff 2025', 'vit cutoff 2027',
    'viteee category cutoff', 'vit category cutoff',
    'vit vellore cutoff', 'vit chennai cutoff',
    'vit ap cutoff', 'vit bhopal cutoff',
    'viteee closing rank', 'vit closing rank',
    'viteee branch wise cutoff', 'vit branch wise cutoff',

    // Marks vs rank
    'viteee marks vs rank', 'viteee rank vs marks',
    'viteee marks to rank', 'vit marks vs rank',
    'viteee marks for cse', 'viteee marks for top branches',

    // Exam pattern / rules
    'viteee exam pattern', 'viteee marking scheme',
    'does viteee have negative marking', 'viteee equi percentile',
    'viteee counselling', 'viteee counselling rule',
    'viteee eligibility', 'viteee counselling eligibility',

    // Predictor terms (so this page also surfaces for those queries)
    'viteee rank predictor', 'viteee college predictor',
    'vit rank predictor', 'vit college predictor',
    'viteee predictor', 'vit predictor',
    'viteee branch predictor', 'vit branch predictor',
    'viteee rank', 'vit rank', 'vit ranks',

    // Fee categories
    'vit category 1', 'vit category 2', 'vit category 3',
    'vit category 4', 'vit category 5',
    'vit fees', 'vit b.tech fees', 'viteee fee category',

    // Campus / brand
    'viteee', 'vitee', 'vit', 'vit vellore', 'vit chennai',
    'vit ap', 'vit bhopal', 'vellore institute of technology',
  ],
  alternates: {
    canonical: '/ranks/info',
  },
  openGraph: {
    title: 'VITEEE 2025 Cutoffs, Marks vs Rank & Counselling Data',
    description:
      'Campus-wise VITEEE 2025 cutoffs, marks-to-rank ladder, counselling eligibility, and 2027 rank-band outlook - the public data behind the predictor.',
    url: '/ranks/info',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VITEEE 2025 Cutoffs & Marks vs Rank - VIT RANKS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VITEEE 2025 Cutoffs & Marks vs Rank',
    description:
      'Every public VITEEE 2025 cutoff, marks-to-rank ladder, counselling rule and exam pattern in one page.',
    images: ['/hompage.png'],
  },
};

export default function RanksInfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RanksInfoJsonLd />
      {children}
    </>
  );
}
