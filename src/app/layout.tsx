import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://ranks.vhome.co.in'),
  title: {
    default: 'Free VITEEE Mock Tests 2026 | VIT RANKS',
    template: '%s | VIT RANKS',
  },
  description:
    'Free, full-length VITEEE 2026 mock tests with instant analytics, a live leaderboard, and the complete syllabus. No signup. No paywall. Built by students, for VITEEE aspirants.',
  keywords: [
    // Registration & dates (highest volume)
    'viteee registration', 'viteee registration 2026', 'viteee registration form',
    'viteee registration last date', 'viteee registration last date 2026',
    'viteee application', 'viteee form', 'viteee exam date',
    'viteee exam date 2026', 'viteee date', 'viteee dates',
    'vit exam date', 'vit exam registration',

    // Mock tests & practice
    'viteee mock test', 'viteee mock tests', 'viteee mock test 2026',
    'viteee free mock test', 'viteee practice test', 'viteee online practice test free',
    'viteee sample paper', 'viteee model paper', 'viteee question paper',
    'viteee test series', 'viteee exam simulator',

    // Previous year papers (PYQ)
    'viteee pyq', 'viteee pyqs', 'viteee previous year question paper',
    'viteee previous year question papers', 'viteee pyq chapterwise pdf',

    // Syllabus & pattern
    'viteee syllabus', 'viteee syllabus 2026', 'viteee exam pattern',
    'vit syllabus', 'does viteee have negative marking',

    // Slot booking & OTBS
    'viteee slot booking', 'viteee slot booking date',
    'viteee slot booking official website', 'vit slot booking',
    'viteee otbs', 'viteee otbs portal', 'vit otbs portal', 'otbs vit',
    'viteee online test booking system',

    // Login & official
    'viteee login', 'viteee.vit.ac.in', 'viteee.vit.ac.in login',
    'viteee official website', 'vit login', 'vit registration',
    'vit official website', 'vit.ac.in', 'vit ac in',

    // Admit card & results
    'viteee admit card', 'viteee admit card 2026',

    // Exam & institute
    'viteee 2026', 'viteee exam', 'vit exam', 'vit entrance exam',
    'vit entrance', 'vit entrance exam 2026', 'vit eee', 'vit',
    'vitmee', 'vitmee mca', 'vitree',
    'vit vellore', 'vit university', 'vit college', 'vit form',
    'vellore institute of technology', 'vellore institute of technology vellore',
    'viteee preparation', 'viteee eligibility',

    // NRI / international / category admissions
    'vit nri', 'vit nri admission', 'vit nri quota', 'vit nri fees',
    'vit nri entrance', 'vit nri entrance exam',
    'viteee nri', 'viteee nri quota',
    'vit foreign students', 'vit international students',
    'vit category 1', 'vit category 2', 'vit c2',

    // Admissions / fees / counselling
    'vit admission', 'vit admission 2026', 'vit b.tech admission',
    'vit b.tech', 'vit fees', 'vit b.tech fees',
    'vit counselling', 'vit counselling 2026', 'viteee counselling',
    'viteee counselling 2026', 'vit hostel', 'vit scholarship',

    // Campus-specific admissions
    'vit vellore admission', 'vit chennai admission',
    'vit bhopal admission', 'vit ap admission',
    'vit vellore admission 2026', 'vit chennai admission 2026',
    'vit bhopal admission 2026', 'vit ap admission 2026',
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
    title: 'Free VITEEE Mock Tests 2026 | VIT RANKS',
    description:
      'Full-length VITEEE 2026 mock tests with instant analytics, a live leaderboard, and the complete syllabus. Free, no signup.',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VIT RANKS - Free VITEEE 2026 Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free VITEEE Mock Tests 2026 | VIT RANKS',
    description:
      'Full-length VITEEE 2026 mock tests, live leaderboard, and syllabus. Free, no signup.',
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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LKRW6B6ZH0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LKRW6B6ZH0');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1967920296589260"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wd7k5hym2x");
          `}
        </Script>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
