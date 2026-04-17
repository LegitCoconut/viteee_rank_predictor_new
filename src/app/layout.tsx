import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
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
    'viteee 2026', 'viteee mock test', 'viteee free mock test',
    'viteee practice test', 'viteee exam', 'vit entrance exam',
    'viteee registration 2026', 'viteee exam date 2026',
    'viteee syllabus 2026', 'viteee exam pattern',
    'viteee preparation', 'viteee admit card 2026',
    'viteee previous year papers', 'viteee sample papers',
    'viteee eligibility', 'viteee slot booking',
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wd7k5hym2x");
          `}
        </Script>
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
