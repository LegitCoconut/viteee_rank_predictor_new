'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PreferredSourceButton } from '@/components/preferred-source';

const STORAGE_KEY = 'donation_popup_last_shown';
// Never interrupt a test in progress or its setup, and never nag on the donate page itself.
const BLOCKED_PATHS = ['/mocktest/start', '/mocktest/setup', '/donate'];
const THROTTLE_MS = 12 * 60 * 60 * 1000; // 12 hours

interface DonationPopupProps {
  delay?: number; // ms before showing, default 17000
}

export function DonationPopup({ delay = 17000 }: DonationPopupProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<'ask' | 'wait'>('ask'); // 'wait' is the second popup, after "Maybe later"
  const pathname = usePathname();
  const blocked = BLOCKED_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (blocked) return;
    const last = localStorage.getItem(STORAGE_KEY);
    if (last && Date.now() - Number(last) < THROTTLE_MS) return;

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, blocked]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  function later() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setStep('wait');
  }

  return (
    <AnimatePresence>
      {visible && !blocked && (
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

                {step === 'ask' ? (
                  <>
                  {/* Heading */}
                  <h2 className="mb-2 pr-6 text-lg font-semibold text-foreground">
                    We&rsquo;re running out of cloud resources
                  </h2>

                  {/* Body */}
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    Our cloud credits are running low. Keeping this platform free
                    costs real money - server costs and storage. If this helped
                    your VITEEE prep, please support us on our donate page and keep
                    it running for everyone.
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <Button asChild className="shrink-0 bg-[#fdeef6] text-[#181121] hover:bg-white" onClick={dismiss}>
                      <Link href="/donate">Support us</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={later}
                      className="text-muted-foreground"
                    >
                      Maybe later
                    </Button>
                  </div>
                  </>
                ) : (
                  <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold text-foreground">Wait, wait, wait!</h2>
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                      If you can&rsquo;t donate right now, you can still help. Recommend VIT Ranks to other students who are
                      preparing, and add us as a preferred source on Google.
                    </p>
                    <div className="flex justify-center">
                      <PreferredSourceButton />
                    </div>
                    <Button variant="ghost" size="sm" onClick={dismiss} className="mt-4 text-muted-foreground">
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
