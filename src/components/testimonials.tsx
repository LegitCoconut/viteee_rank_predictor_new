import { Quote } from "lucide-react";
import testimonials from "@/lib/data/testimonials.json";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export function Testimonials() {
  return (
    <section id="testimonials" className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Real words from <span className="gradient-text">real</span> aspirants.
          </h2>
          <p className="mt-3 text-balance text-base text-muted-foreground md:text-lg">
            Straight from the feedback inbox, lightly trimmed and punctuated.
          </p>
        </div>

        <div className="mx-auto max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {testimonials.map((t) => (
            <figure
              key={`${t.name}-${t.quote}`}
              className="break-inside-avoid rounded-2xl border border-border bg-card p-5"
            >
              <Quote className="h-4 w-4 text-coral" aria-hidden="true" />
              <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
                >
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">VITEEE aspirant</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
