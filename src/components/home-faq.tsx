import { HOME_FAQ } from '@/lib/home-faq';

export function HomeFaq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-5xl">
          VITEEE 2027: frequently asked questions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Quick answers on the exam, dates, pattern, rank prediction and our mock tests.
        </p>
        <div className="mt-10 space-y-3">
          {HOME_FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border/40 bg-card/60 p-5 transition-colors hover:border-coral/40 open:border-coral/40"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
                  {item.q}
                </h3>
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 text-coral transition-transform group-open:rotate-45">
                  <span className="text-xl leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
