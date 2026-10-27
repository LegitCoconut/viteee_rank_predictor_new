'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            onClick={dismiss}
          />

          {/* Card (flex wrapper centers it; framer's transform would override a translate-based centering) */}
          <div
            key="card-wrap"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto w-full max-w-md"
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

                {/* Heading */}
                <h2 className="mb-2 pr-6 text-lg font-semibold text-foreground">
                  We&rsquo;re running out of cloud resources
                </h2>

                {/* Body */}
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  Our cloud credits are running low. Keeping this platform free
                  costs real money - server costs and storage. If this helped
                  your VITEEE prep, buy us a coffee and keep it running for
                  everyone.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="https://buymeacoffee.com/legitcoconut"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismiss}
                    aria-label="Buy Malabar Matrix a coffee on Buy Me a Coffee"
                    className="shrink-0 rounded-lg transition-transform hover:scale-[1.03] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Image
                      src="/bmc/bmc-button.png"
                      alt="Buy me a coffee"
                      width={218}
                      height={61}
                      className="h-11 w-auto"
                    />
                  </a>
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
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
