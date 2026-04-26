'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Cloud, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'donation_popup_last_shown';
const THROTTLE_MS = 12 * 60 * 60 * 1000; // 12 hours

interface DonationPopupProps {
  delay?: number; // ms before showing, default 17000
}

export function DonationPopup({ delay = 17000 }: DonationPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    if (last && Date.now() - Number(last) < THROTTLE_MS) return;

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--coral))] to-[hsl(var(--peach))]">
                <Cloud className="h-6 w-6 text-[hsl(var(--primary-foreground))]" />
              </div>

              {/* Heading */}
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                We&rsquo;re running low on cloud resources
              </h2>

              {/* Body */}
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Keeping this platform free costs real money — server costs, AI
                usage, and storage are adding up. If this helped your VITEEE
                prep, even a small contribution keeps it alive for everyone.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button asChild className="flex-1 gap-2" onClick={dismiss}>
                  <Link href="/donate">
                    <Heart className="h-4 w-4" />
                    Support the project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismiss}
                  className="text-muted-foreground"
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
