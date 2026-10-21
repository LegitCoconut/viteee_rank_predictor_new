'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  className?: string;
}

export function AdSlot({ slot = '7475856879', className = '' }: AdSlotProps) {
  // The AdSense script mutates <ins> (attributes + iframe), so render it client-only to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adblock active or script not yet loaded
    }
  }, [mounted]);

  return (
    <div className={`my-8 mx-auto w-full max-w-3xl px-4 ${className}`}>
      {mounted && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1967920296589260"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
