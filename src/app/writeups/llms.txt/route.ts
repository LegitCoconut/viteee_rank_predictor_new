import { getWriteups } from '@/lib/writeups';

export const dynamic = 'force-static';

const SITE = 'https://ranks.vhome.co.in';

// Every write-up in full, as one markdown document for LLM crawlers. New files
// in /content/writeups show up here automatically.
export function GET() {
  const parts = getWriteups().map(
    (w) =>
      `Source: ${SITE}/writeups/${w.slug}\n${w.date ? `Published: ${w.date.toISOString().slice(0, 10)}\n` : ''}\n` +
      w.raw.trim().replace(/\]\(\//g, `](${SITE}/`),
  );
  const body =
    `# VIT Ranks - Write-ups (full text)\n\n` +
    `> Guides on VITEEE 2027 by VIT Ranks (${SITE}/writeups), cross-checked against the official VITEEE site. ` +
    `Independent and not affiliated with VIT. Dates and rules can change; confirm on https://viteee.vit.ac.in/.\n\n` +
    parts.join('\n\n---\n\n') +
    '\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
