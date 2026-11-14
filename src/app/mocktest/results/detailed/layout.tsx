import type { Metadata } from 'next';

// This route's page is a client component, so its metadata lives here. Without it
// the page inherits the /mocktest title, description and canonical. The brand
// suffix is explicit because a parent layout's string title drops the template.
export const metadata: Metadata = {
  title: 'VITEEE Mock Test Review: Question-wise Analysis | VIT RANKS',
  description:
    'Review every question from your VITEEE mock test with correct answers, your responses and where you lost marks, section by section.',
  alternates: { canonical: '/mocktest/results/detailed' },
};

export default function MocktestDetailedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
