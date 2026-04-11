import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://ranks.vhome.co.in'),
  title: {
    default: 'VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS',
    template: '%s | VIT RANKS',
  },
  description: 'Predict your VITEEE 2026 rank, take free mock tests, view syllabus, exam pattern & cutoff. No signup required. The #1 student community for VITEEE preparation.',
  keywords: [
    'viteee 2026', 'viteee rank predictor', 'viteee mock test', 'viteee exam',
    'vit entrance exam', 'viteee registration 2026', 'viteee exam date 2026',
    'viteee syllabus 2026', 'viteee exam pattern', 'viteee cutoff',
    'vit vellore admission', 'viteee preparation', 'viteee free mock test',
    'viteee practice test', 'viteee college predictor', 'vit rank predictor',
    'viteee registration last date', 'viteee admit card 2026',
    'viteee previous year papers', 'viteee sample papers',
  ],
  authors: [{ name: 'VIT RANKS' }],
  creator: 'VIT RANKS',
  publisher: 'VIT RANKS',
  verification: {
    google: ['1un__YAfOUDSv7-dtHBNXq1sbPUzZUMqTRd2PHwZZ_c', 'XEmVf0HC5gSKAzEyGH2uA7J8VceJWPRFYAIMje6fGNw'],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'VIT RANKS',
    title: 'VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS',
    description: 'Predict your VITEEE 2026 rank, take free mock tests, view syllabus, exam pattern & cutoff. No signup required.',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VIT RANKS - VITEEE Rank Predictor and Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS',
    description: 'Predict your VITEEE 2026 rank, take free mock tests, view syllabus & exam pattern. No signup required.',
    images: ['/hompage.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
