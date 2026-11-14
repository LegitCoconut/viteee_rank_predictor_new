import type { Metadata } from 'next';

// /terms is a client component, so its metadata lives in the route layout.
export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms of use for VIT RANKS: how the free VITEEE mock tests and rank predictor work, where question and cutoff data comes from, leaderboard names and your data.',
  alternates: { canonical: '/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
