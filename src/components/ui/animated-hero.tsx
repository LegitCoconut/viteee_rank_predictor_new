"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MoveRight, Users, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Predict Ranks", "Practice Mocks", "Succeed"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-8 py-24 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-5 flex-col items-center">
            <Link href="https://malabarmatrix.site" target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="py-1.5 px-4 border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm">
                A Malabar Matrix Initiative
              </Badge>
            </Link>
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-headline">
              <span className="text-foreground">Your All-in-One</span>
              <br />
              <span className="text-foreground">VITEEE Hub</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 text-primary">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -50 : 50, opacity: 0, position: 'absolute' }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Predict your potential branches with our rank data and prepare for VITEEE 2026 with free mock tests. Your complete toolkit for success.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              { icon: Award, label: 'Rank Predictor', sublabel: 'Campus & branch wise' },
              { icon: FileText, label: 'Mock Tests', sublabel: 'Real exam pattern' },
              { icon: Users, label: 'By Students', sublabel: 'For VITEEE aspirants' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/20" asChild>
              <Link href="/">
                Predict Rank & College <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-2 px-8 h-12 text-base" variant="outline" asChild>
              <Link href="/mocktest">
                VITEEE Mock Test <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
