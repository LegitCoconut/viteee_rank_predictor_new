import { HOME_FAQ } from '@/lib/home-faq';

export function WebsiteJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VIT RANKS',
    url: 'https://ranks.vhome.co.in',
    description:
      'Free, full-length VITEEE 2027 mock tests with instant analytics and a live leaderboard. No signup required.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ranks.vhome.co.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VIT RANKS',
    url: 'https://ranks.vhome.co.in',
    logo: 'https://ranks.vhome.co.in/logo.png',
    description:
      'Free VITEEE mock tests, syllabus, and exam preparation resources for VIT entrance exam 2027.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}

export function FAQJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export function MockTestJsonLd() {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Free VITEEE Mock Test 2027',
    description:
      'Practice with free VITEEE mock tests covering Physics, Chemistry, Mathematics, and Aptitude. No signup required.',
    provider: {
      '@type': 'Organization',
      name: 'VIT RANKS',
      url: 'https://ranks.vhome.co.in',
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ranks.vhome.co.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'VITEEE Mock Test',
        item: 'https://ranks.vhome.co.in/mocktest',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
