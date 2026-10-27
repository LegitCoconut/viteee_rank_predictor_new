import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const surfaces = [
  {
    key: "modern",
    tag: "Default",
    title: "Modern",
    subtitle: "Our own clean, dark take on the CBT. Works on laptop, tablet and phone.",
    imageSrc: `${R2}/images/ui-vitranks.webp`,
    imageAlt: "VIT Ranks modern exam UI with dark theme and A/B/C/D answer buttons",
    features: ["Minimal chrome, more reading space", "Per-subject palette with answered and marked colours"],
  },
  {
    key: "viteee",
    tag: "VITEEE-CBT",
    title: "VITEEE-style",
    subtitle: "Mirrors the official CBT interface so test day feels familiar.",
    imageSrc: `${R2}/images/vit-ui.webp`,
    imageAlt: "VITEEE-style CBT UI with section tabs, numbered palette and Save & Next",
    features: ["Section and subject tabs, Save & Next", "Numbered palette with the 5-state legend"],
  },
];

export function DualUIShowcase() {
  return (
    <section id="exam-ui" className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Two UIs. One set of mocks.
          </h2>
          <p className="mt-3 text-balance text-base text-muted-foreground md:text-lg">
            Same questions, same clock, same scoring. Just pick the interface.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
          {surfaces.map((s) => (
            <article key={s.key} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-video overflow-hidden border-b md:aspect-16/10 border-border bg-background">
                <img
                  src={s.imageSrc}
                  alt={s.imageAlt}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <span className="text-xs font-medium text-muted-foreground">{s.tag}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.subtitle}</p>
                <ul className="mt-3 hidden space-y-1.5 md:block">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <Button variant="secondary" asChild>
            <Link href="/mocktest">
              Start a mock and pick your UI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">Your choice is remembered for next time.</p>
        </div>
      </div>
    </section>
  );
}
