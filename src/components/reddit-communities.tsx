"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MessagesSquare } from "lucide-react";

const communities = [
  { sub: "Vit", tag: "VIT Vellore", desc: "The biggest VIT community: hostel, clubs, academics and campus life questions." },
  { sub: "vitchennai", tag: "VIT Chennai", desc: "Chennai campus students: placements, branch advice and day-to-day life." },
  { sub: "vitap", tag: "VIT-AP", desc: "Amaravati campus: campus questions, academics and what to expect on joining." },
  { sub: "vitbhopal", tag: "VIT Bhopal", desc: "Bhopal campus: CGPA, results, branch change and placement talk." },
];

// Only the two production hosts are tagged; localhost and preview URLs get a clean link.
const UTM_HOSTS = ["viteee.malabarmatrix.site", "ranks.vhome.co.in"];

export function RedditCommunities() {
  const [utm, setUtm] = useState("");

  useEffect(() => {
    const host = window.location.hostname;
    if (UTM_HOSTS.includes(host)) setUtm(`?utm_source=${host}`);
  }, []);

  return (
    <section id="reddit" className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            The VIT subreddits
          </h2>
          <p className="mt-3 text-balance text-base text-muted-foreground md:text-lg">
            One corner of Reddit for each campus. Ask seniors, read honest takes, pick your campus.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communities.map((c) => (
            <a
              key={c.sub}
              href={`https://www.reddit.com/r/${c.sub}/${utm}`}
              target="_blank"
              rel="noopener"
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-coral/60"
            >
              <div className="flex items-center justify-between">
                <MessagesSquare className="h-5 w-5 text-coral" aria-hidden />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">r/{c.sub}</h3>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-coral">{c.tag}</span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Free · no Reddit account required to read</p>
      </div>
    </section>
  );
}
