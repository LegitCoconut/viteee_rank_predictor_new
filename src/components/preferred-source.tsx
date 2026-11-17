'use client';

import { useLayoutEffect, useRef } from 'react';

// Google's "Add to preferred sources" library only looks for its button once, when it loads, so a button added
// later (a popup, or a page reached by client-side navigation) would stay empty. The root layout therefore renders
// one button (#psb-host) in a hidden #psb-store, and every PreferredSourceButton moves that one button into its slot.
// The most recently mounted slot owns it; closing it hands the button back to the one below, or to the store.
const slots: HTMLElement[] = [];
let host: HTMLElement | null = null; // kept by reference: once its slot is removed from the page it can no longer be found by id

function place() {
  host ??= document.getElementById('psb-host');
  const target = slots[slots.length - 1] ?? document.getElementById('psb-store');
  if (host && target) target.appendChild(host);
}

export function PreferredSourceButton() {
  const slot = useRef<HTMLDivElement>(null);
  // A layout effect, so the button is moved out before React takes the slot off the page.
  useLayoutEffect(() => {
    const el = slot.current!;
    slots.push(el);
    place();
    return () => {
      slots.splice(slots.indexOf(el), 1);
      place();
    };
  }, []);
  return <div ref={slot} className="flex min-h-10 justify-center" />;
}

// The button in the root layout, as the library expects it, in a hidden holder.
export function PreferredSourceStore() {
  return (
    <div
      id="psb-store"
      hidden
      dangerouslySetInnerHTML={{ __html: '<div id="psb-host" google-add-preferred-source-btn data-theme="dark"></div>' }}
    />
  );
}

// A short section with the button, for the bottom of the long pages.
export function PreferredSource() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-14" aria-labelledby="preferred-source">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
        <h2 id="preferred-source" className="text-xl font-semibold tracking-tight">See VIT Ranks first on Google</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Add us as a preferred source and our updates will show up more often in your Google Top Stories.
        </p>
        <PreferredSourceButton />
      </div>
    </section>
  );
}
