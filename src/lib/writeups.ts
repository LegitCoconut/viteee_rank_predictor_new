import fs from 'node:fs';
import path from 'node:path';

// Write-ups are plain markdown files in /content/writeups. Add a file there and
// it appears on /writeups, gets its own page, lands in the sitemap and in the
// /writeups/llms.txt feed. Expected shape (no frontmatter needed):
//   # Title
//   <date, e.g. Nov 14, 2026>
//   <first paragraph = summary, used for the card and meta description>
//   ## Sections...
//   ## Frequently asked questions   (optional; each "### question" + answer
//                                    becomes a visible FAQ and FAQPage schema)
const DIR = path.join(process.cwd(), 'content', 'writeups');

export interface Faq {
  q: string;
  a: string;
}

export interface Writeup {
  slug: string;
  title: string;
  byline: string;
  summary: string;
  body: string; // markdown without the title, byline and FAQ section
  raw: string; // the whole file, for the llms feed
  faq: Faq[];
  headings: { id: string; text: string }[];
  minutes: number;
  date: Date | null;
}

export const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Markdown to plain text, for schema.org answers.
export const plain = (md: string) =>
  md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();

function parse(slug: string, raw: string): Writeup {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  const title = (lines[titleIdx] ?? `# ${slug}`).slice(2).trim();
  let rest = lines.slice(titleIdx + 1);

  // Pull the FAQ section out of the body.
  const faq: Faq[] = [];
  const faqStart = rest.findIndex((l) => /^##\s+(frequently asked questions|faq)\s*$/i.test(l.trim()));
  if (faqStart !== -1) {
    let faqEnd = rest.findIndex((l, i) => i > faqStart && l.startsWith('## '));
    if (faqEnd === -1) faqEnd = rest.length;
    let cur: { q: string; a: string[] } | null = null;
    for (const l of rest.slice(faqStart + 1, faqEnd)) {
      if (l.startsWith('### ')) {
        if (cur) faq.push({ q: cur.q, a: cur.a.join(' ').trim() });
        cur = { q: l.slice(4).trim(), a: [] };
      } else if (cur && l.trim()) cur.a.push(l.trim());
    }
    if (cur) faq.push({ q: cur.q, a: cur.a.join(' ').trim() });
    rest = [...rest.slice(0, faqStart), ...rest.slice(faqEnd)];
  }

  const nonEmpty = rest.map((l) => l.trim()).filter(Boolean);
  const byline = /^[A-Z][a-z]{2} \d{1,2}, \d{4}/.test(nonEmpty[0] ?? '') ? nonEmpty[0] : '';
  const summary = nonEmpty.find((l) => l !== byline && !/^[#|*\-\d]/.test(l)) ?? '';
  const body = (byline ? rest.join('\n').replace(byline, '') : rest.join('\n')).trim();
  const parsed = byline ? new Date(`${byline.split('·')[0].trim()} UTC`) : null;
  const headings = body
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .map((l) => ({ id: slugify(l.slice(3)), text: l.slice(3).trim() }));
  if (faq.length) headings.push({ id: 'faq', text: 'Frequently asked questions' });

  return {
    slug,
    title,
    byline,
    summary: plain(summary),
    body,
    raw,
    faq,
    headings,
    minutes: Math.max(1, Math.round(raw.split(/\s+/).length / 220)),
    date: parsed && !isNaN(parsed.getTime()) ? parsed : null,
  };
}

export function getWriteups(): Writeup[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parse(f.replace(/\.md$/, ''), fs.readFileSync(path.join(DIR, f), 'utf8')))
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}

export function getWriteup(slug: string): Writeup | undefined {
  return getWriteups().find((w) => w.slug === slug);
}
