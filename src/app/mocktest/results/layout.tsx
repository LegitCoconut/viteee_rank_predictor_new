import type { Metadata } from 'next';

// This route's page is a client component, so its metadata lives here. Without it
// the page inherits the /mocktest title, description and canonical. The brand
// suffix is explicit because a parent layout's string title drops the template.
export const metadata: Metadata = {
  title: 'VITEEE Mock Test Result: Score & Section Analysis | VIT RANKS',
  description:
    'See your VITEEE mock test score out of 400 with a section-wise breakdown, then compare yourself on the leaderboard and predict your VIT rank.',
  alternates: { canonical: '/mocktest/results' },
};

export default function MocktestResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
