"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Info, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["easily", "quickly", "confidently", "now"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            <Link href="https://malabarmatrix.site" target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary hover:bg-primary/10 transition-colors">A Malabar Matrix Project</Badge>
            </Link>
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-headline">
              <span className="text-muted-foreground">Find Your VIT Branch</span>
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
              Enter your VITEEE 2026 rank and instantly see which branches and campuses you are eligible for. Make an informed decision about your future.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="#rank-predictor-section">
                Check Your Rank <ArrowDown className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-2 hover:bg-gray-200 hover:text-black" variant="outline">
              Learn More <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
