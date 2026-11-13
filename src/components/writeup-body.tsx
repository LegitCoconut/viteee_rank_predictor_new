import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { slugify } from '@/lib/writeups';

const components: Components = {
  h2: ({ children, ...p }) => (
    <h2
      id={slugify(Children.toArray(children).join(''))}
      className="mt-12 scroll-mt-20 text-2xl font-semibold tracking-tight md:text-3xl"
      {...p}
    >
      {children}
    </h2>
  ),
  h3: (p) => <h3 className="mt-8 text-xl font-semibold tracking-tight" {...p} />,
  p: (p) => <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg" {...p} />,
  ul: (p) => <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-white/90 md:text-lg" {...p} />,
  ol: (p) => <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-white/90 md:text-lg" {...p} />,
  strong: (p) => <strong className="font-semibold text-white" {...p} />,
  a: ({ href, ...p }) => {
    const external = /^https?:/.test(href ?? '');
    return (
      <a
        href={href}
        className="font-medium underline underline-offset-4 hover:text-coral"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...p}
      />
    );
  },
  table: (p) => (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm md:text-base" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-border/60 px-4 py-3 font-semibold" {...p} />,
  td: (p) => <td className="border-b border-border/40 px-4 py-3 text-white/90 last:border-b-0" {...p} />,
};

export function WriteupBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
