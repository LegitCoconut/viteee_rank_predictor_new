'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';

// A UPI QR code (scan it from another phone) plus the id with a copy button; the pay link opens the visitor's UPI app on a phone.
export function CopyUpi({ id }: { id: string }) {
  const link = `upi://pay?pa=${encodeURIComponent(id)}&pn=Malabar%20Matrix&cu=INR`;
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the id stays visible and can be selected by hand
    }
  }
  return (
    <div className="mt-6 flex w-full max-w-sm flex-col items-center">
      {/* Dark modules on a white card with a quiet zone, so any UPI app can scan it on the dark page. */}
      <div className="rounded-2xl bg-white p-3 shadow-lg">
        <QRCodeSVG value={link} size={176} level="M" marginSize={0} role="img" title={`UPI QR code for ${id}`} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Scan with any UPI app</p>
      <div className="mt-4 w-full">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3">
        <code className="select-all text-base font-semibold tracking-tight">{id}</code>
        <Button type="button" size="sm" variant="secondary" onClick={copy} aria-label="Copy UPI id">
          {copied ? <Check className="mr-1.5 size-4" /> : <Copy className="mr-1.5 size-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <a
        href={link}
        className="mt-3 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground md:hidden"
      >
        Open in my UPI app
      </a>
      </div>
    </div>
  );
}
