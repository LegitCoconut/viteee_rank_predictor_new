export function WebsiteJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VIT RANKS',
    url: 'https://ranks.vhome.co.in',
    description:
      'Free, full-length VITEEE 2026 mock tests with instant analytics and a live leaderboard. No signup required.',
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
      'Free VITEEE mock tests, syllabus, and exam preparation resources for VIT entrance exam 2026.',
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
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is VITEEE 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'VITEEE (VIT Engineering Entrance Exam) 2026 is the entrance examination conducted by Vellore Institute of Technology for admission to B.Tech programs across its campuses in Vellore, Chennai, AP, and Bhopal.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many mock tests can I take on VIT RANKS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can take unlimited VITEEE mock tests on VIT RANKS. Choose from curated papers or generate a fresh randomised 125-question test anytime. Every attempt comes with instant analytics and a live leaderboard.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the VITEEE mock tests on VIT RANKS free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all VITEEE mock tests on VIT RANKS are completely free and require no signup. You can take unlimited practice tests covering Physics, Chemistry, Mathematics, and Aptitude.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the VITEEE 2026 exam pattern?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'VITEEE 2026 consists of 125 questions from Physics (35), Chemistry (35), Mathematics/Biology (35), Aptitude (10), and English (10). The exam duration is 2 hours 30 minutes and is conducted in online CBT mode.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the VITEEE 2026 syllabus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The VITEEE 2026 syllabus covers Physics, Chemistry, Mathematics (or Biology), English, and Aptitude. The syllabus is based on the 11th and 12th standard curriculum. You can view and download the complete syllabus on VIT RANKS.',
        },
      },
    ],
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
    name: 'Free VITEEE Mock Test 2026',
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
