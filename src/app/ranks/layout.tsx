import type { Metadata } from 'next';

// /ranks is a client component (it parses URL state in useEffect), so its
// metadata lives here in the route layout. /ranks/info has its own layout
// that overrides these values.
export const metadata: Metadata = {
  title: 'VITEEE Rank Predictor & VIT College Predictor 2027',
  description:
    'Free VITEEE rank predictor & VIT college predictor. Enter your VITEEE rank to see which campus (VIT Vellore, Chennai, AP, Bhopal) and B.Tech branch you can secure across all 5 fee categories. Drag-to-reorder, PDF export, shareable QR. Based on 2025 cutoff data.',
  keywords: [
    // Primary intent (highest impressions in search console)
    'viteee rank predictor', 'viteee rank predictor 2027',
    'vit rank predictor', 'vit rank predictor 2027',
    'viteee college predictor', 'viteee college predictor 2027',
    'vit college predictor', 'vit college predictor 2027',
    'vitee college predictor', 'college predictor viteee',
    'viteee predictor', 'vit predictor',
    'viteee branch predictor', 'vit branch predictor',
    'vit rank calculator', 'viteee rank college predictor',
    'viteee college predictor free', 'vit college predictor free',
    'viteee rank', 'vit rank', 'vit ranks', 'vitee rank',

    // Campus-wise admit predictions
    'vit vellore admission', 'vit chennai admission',
    'vit bhopal admission', 'vit ap admission',
    'vit vellore cutoff', 'vit chennai cutoff',
    'vit ap cutoff', 'vit bhopal cutoff',

    // Counselling
    'viteee counselling', 'viteee counselling 2027',
    'vit counselling 2027', 'viteee counselling options',
    'vit b.tech admission', 'vit admission 2027',

    // Fee category
    'vit category 1', 'vit category 2', 'vit category 3',
    'vit category 4', 'vit category 5', 'viteee fee category',
    'vit fees', 'vit b.tech fees',

    // Related brand queries
    'viteee', 'vitee', 'vit', 'vit entrance exam 2027',
  ],
  alternates: {
    canonical: '/ranks',
  },
  openGraph: {
    title: 'VITEEE Rank Predictor & VIT College Predictor 2027',
    description:
      'Predict which VIT campus and branch your VITEEE rank can secure. Free, no signup. Drag-to-reorder, PDF export, QR share.',
    url: '/ranks',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VITEEE Rank & College Predictor 2027 - VIT RANKS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VITEEE Rank & College Predictor 2027',
    description:
      'Free VITEEE rank & college predictor for VIT Vellore, Chennai, AP, Bhopal. Based on 2025 cutoffs.',
    images: ['/hompage.png'],
  },
};

export default function RanksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
