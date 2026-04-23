'use client';

import { useEffect, useState } from 'react';

export function useCachedImage(url: string): string {
  const [src, setSrc] = useState(url);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    const key = `imgcache:${url}`;

    async function load() {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          if (!cancelled) setSrc(cached);
          return;
        }
      } catch {}

      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (cancelled) return;
          const dataUrl = reader.result as string;
          try {
            localStorage.setItem(key, dataUrl);
          } catch {}
          setSrc(dataUrl);
        };
        reader.readAsDataURL(blob);
      } catch {}
    }

    load();
    return () => { cancelled = true; };
  }, [url]);

  return src;
}
