import ReactMarkdown from 'react-markdown';
import { plain, type Faq } from '@/lib/writeups';

// Visible FAQ plus matching FAQPage JSON-LD, so the schema always equals what readers see.
export function faqSchema(items: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: plain(a) },
    })),
  };
}

export function WriteupFaq({ items, title = 'Frequently asked questions' }: { items: Faq[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="mt-14 scroll-mt-20">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group rounded-2xl border border-border/60 bg-card p-5 open:border-white/60">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <h3 className="text-base font-semibold leading-snug md:text-lg">{item.q}</h3>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/40 text-xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ReactMarkdown
              components={{
                p: (p) => <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base" {...p} />,
                a: (p) => <a className="font-medium underline underline-offset-4 hover:text-coral" {...p} />,
              }}
            >
              {item.a}
            </ReactMarkdown>
          </details>
        ))}
      </div>
    </section>
  );
}
