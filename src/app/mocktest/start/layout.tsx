import type { Metadata } from 'next';

// This route's page is a client component, so its metadata lives here. Without it
// the page inherits the /mocktest title, description and canonical. The brand
// suffix is explicit because a parent layout's string title drops the template.
export const metadata: Metadata = {
  title: 'Live VITEEE Mock Test 2027: Exam Mode | VIT RANKS',
  description:
    'Sit the VITEEE 2027 mock test in an exam-style window: 100 questions, 2 hours, separate timers for Mathematics, Physics, Chemistry and Aptitude.',
  alternates: { canonical: '/mocktest/start' },
};

export default function MocktestStartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
