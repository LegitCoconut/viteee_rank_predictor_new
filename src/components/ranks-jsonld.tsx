import {
  COURSE_DATA,
  CAMPUS_LABELS,
  Campus,
} from '@/lib/viteee-data';

// Structured-data payloads for /ranks and /ranks/info. The page components are
// `'use client'`, so these get injected through their server layouts. React
// renders children of <script type="application/ld+json"> as raw script
// content, which is the pattern next.js recommends for inline JSON-LD.

const SITE = 'https://ranks.vhome.co.in';
const STUDIO = 'https://malabarmatrix.site';
const INSTAGRAM = 'https://www.instagram.com/malabar.matrix';

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}#org`,
  name: 'VIT Ranks · Malabar Matrix',
  url: SITE,
  logo: `${SITE}/logo.png`,
  sameAs: [STUDIO, INSTAGRAM],
} as const;

const CAMPUS_PROVIDERS: Record<Campus, { name: string; url: string }> = {
  vellore: { name: 'Vellore Institute of Technology, Vellore', url: 'https://vit.ac.in/' },
  chennai: { name: 'VIT Chennai', url: 'https://chennai.vit.ac.in/' },
  ap: { name: 'VIT-AP University', url: 'https://vitap.ac.in/' },
  bhopal: { name: 'VIT Bhopal University', url: 'https://vitbhopal.ac.in/' },
};

export function RanksAppJsonLd() {
  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      {
        '@type': 'WebApplication',
        '@id': `${SITE}/ranks#app`,
        name: 'VITEEE Rank & College Predictor',
        url: `${SITE}/ranks`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any (web)',
        browserRequirements: 'Requires JavaScript. Modern browser.',
        isAccessibleForFree: true,
        inLanguage: 'en',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        creator: { '@id': `${SITE}#org` },
        about: [
          'VITEEE 2026',
          'VITEEE rank predictor',
          'VIT college predictor',
          'VIT Vellore admission',
          'VIT Chennai admission',
          'VIT AP admission',
          'VIT Bhopal admission',
        ],
        featureList: [
          'Map VITEEE rank to securable + reach courses',
          'Filter by branch (CS / Electronics / Mechanical / Core), fee category, and campus',
          'Drag-to-reorder counselling list',
          'Downloadable PDF report with QR for shareable view',
          'Shareable URL that regenerates the same filtered table',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Rank Predictor', item: `${SITE}/ranks` },
        ],
      },
    ],
  };
  return <script type="application/ld+json">{JSON.stringify(payload)}</script>;
}

export function RanksInfoJsonLd() {
  // Emit one Course entry per COURSE_DATA row so dataset-aware AI search can
  // quote individual programmes, with one CourseInstance per fee category.
  const courseEntries = COURSE_DATA.map((c) => ({
    '@type': 'Course',
    name: `${c.course} — ${CAMPUS_LABELS[c.campus]}`,
    description: `${c.course} at ${CAMPUS_LABELS[c.campus]}. 2025 closing ranks across five VIT fee categories: Cat 1 ${c.categories[0]}, Cat 2 ${c.categories[1]}, Cat 3 ${c.categories[2]}, Cat 4 ${c.categories[3]}, Cat 5 ${c.categories[4]}.`,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: CAMPUS_PROVIDERS[c.campus].name,
      url: CAMPUS_PROVIDERS[c.campus].url,
    },
    educationalLevel: 'Bachelor',
    courseCode: c.id,
    hasCourseInstance: c.categories.map((closingRank, i) => ({
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      name: `Category ${i + 1}`,
      description: `Fee category ${i + 1}. 2025 VITEEE closing rank: ${closingRank}.`,
    })),
  }));

  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      {
        '@type': 'Dataset',
        '@id': `${SITE}/ranks/info#dataset`,
        name: 'VITEEE 2025 closing ranks by campus, branch and fee category',
        description:
          'Public 2025 VITEEE closing ranks for every B.Tech programme across VIT Vellore, VIT Chennai, VIT AP and VIT Bhopal, broken down by all five fee categories. Includes the equi-percentile marks-to-rank ladder and counselling eligibility rule.',
        url: `${SITE}/ranks/info`,
        keywords: [
          'VITEEE 2025 cutoff',
          'VIT cutoff',
          'VIT Vellore cutoff',
          'VIT Chennai cutoff',
          'VIT AP cutoff',
          'VIT Bhopal cutoff',
          'VITEEE marks vs rank',
          'VIT category cutoff',
          'VITEEE counselling',
        ],
        creator: { '@id': `${SITE}#org` },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        isAccessibleForFree: true,
        distribution: [
          {
            '@type': 'DataDownload',
            encodingFormat: 'text/html',
            contentUrl: `${SITE}/ranks/info`,
          },
          {
            '@type': 'DataDownload',
            encodingFormat: 'text/plain',
            contentUrl: `${SITE}/llms-full.txt`,
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Rank Predictor', item: `${SITE}/ranks` },
          { '@type': 'ListItem', position: 3, name: 'Data', item: `${SITE}/ranks/info` },
        ],
      },
      ...courseEntries,
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(payload)}</script>;
}
