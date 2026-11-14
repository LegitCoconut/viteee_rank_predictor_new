import type { Metadata } from 'next';

// This route's page is a client component, so its metadata lives here. Without it
// the page inherits the /mocktest title, description and canonical. The brand
// suffix is explicit because a parent layout's string title drops the template.
export const metadata: Metadata = {
  title: 'Start a VITEEE Mock Test: Rules & Setup | VIT RANKS',
  description:
    'Read the VITEEE 2027 mock test rules, enter your name and stream, and start a free 100-question, 2-hour test with per-section timers. No signup needed.',
  alternates: { canonical: '/mocktest/setup' },
};

export default function MocktestSetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
