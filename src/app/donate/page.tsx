'use client';

import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

const UPI_ID = 'mail.adithyanp-2@oksbi';
const PAYEE_NAME = 'Malabar Matrix';

function buildUpiLink(amount: number) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: 'INR',
  });
  return `upi://pay?${params.toString()}`;
}

const SUGGESTED = [49, 99, 199, 499];

const TIERS = [
  { amount: 49, title: 'A cup of chai', body: 'Keeps one free-tier server alive for a day.' },
  { amount: 199, title: 'A new mock set', body: 'Funds licensing a fresh batch of practice questions.' },
  { amount: 499, title: 'A new feature', body: 'Pays for a weekend of development on the next big thing.' },
];

const PRINCIPLES = [
  { title: 'Built by students', body: "We know what the grind feels like, because we're in it." },
  { title: 'Free, forever', body: 'No signup, no paywall, no upsell. The mock tests stay free.' },
  { title: 'No data games', body: 'Your attempts stay on your device. We never sell or trade data.' },
  { title: 'More on the way', body: 'Next up: JEE, NEET and CUET tools. Your support speeds us up.' },
];

type Phase = 'form' | 'qr' | 'verify' | 'done';

export default function DonatePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const amount = useMemo(() => {
    const n = Number(amountStr);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }, [amountStr]);

  const validEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email],
  );
  const validName = name.trim().length >= 2;
  const canContinue = validName && validEmail && amount > 0;

  const upiLink = useMemo(() => (amount > 0 ? buildUpiLink(amount) : ''), [amount]);

  function pickTierAmount(v: number) {
    setAmountStr(String(v));
    if (typeof window !== 'undefined') {
      document
        .getElementById('donate-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async function handleMarkPaid() {
    if (!token) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), amount, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.message ?? 'Could not record the donation.');
        setSubmitting(false);
        return;
      }
      setPhase('done');
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="hero-mesh py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Help keep VIT RANKS <span className="gradient-text">free</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              VIT RANKS is free and ad-free, and we want it to stay that way. If it helped you study and
              you can spare the price of a cup of chai, it keeps the servers running and the next feature coming.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Student-built &middot; No ads, no paywall &middot; Genuinely free
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-semibold tracking-tight">Where the money goes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Small sums, spent directly on keeping this live.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {TIERS.map((t) => {
              const active = amount === t.amount;
              return (
                <button
                  key={t.amount}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickTierAmount(t.amount)}
                  className={`rounded-2xl border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active ? 'border-coral bg-coral/5' : 'border-border bg-card hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold tabular-nums">&#8377;{t.amount}</span>
                    {active && <span className="text-xs font-medium text-coral">Selected</span>}
                  </div>
                  <p className="mt-2 text-sm font-medium">{t.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section id="donate-form" className="container mx-auto mt-12 max-w-5xl scroll-mt-20 px-4">
          <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-semibold tracking-tight">Your details</h2>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-name">Name</Label>
                  <Input id="donor-name" placeholder="Arjun Menon" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-email">Email</Label>
                  <Input id="donor-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-amount">
                    Amount <span className="text-muted-foreground">(INR)</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">&#8377;</span>
                    <Input
                      id="donor-amount"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder="49"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9]/g, ''))}
                      className="h-11 pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTED.map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={amount === v}
                        onClick={() => setAmountStr(String(v))}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          amount === v ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        &#8377;{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 text-center md:p-8">
              <h2 className="text-xl font-semibold tracking-tight">{amount > 0 ? `Pay \u20B9${amount}` : 'Your QR code'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {amount > 0 ? 'Works with GPay, PhonePe, Paytm, BHIM and any UPI app.' : 'Enter an amount to see the QR code.'}
              </p>

              <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center rounded-xl bg-white p-3">
                {amount > 0 && upiLink ? (
                  <QRCodeSVG value={upiLink} size={200} bgColor="#ffffff" fgColor="#111111" level="M" includeMargin={false} />
                ) : (
                  <p className="px-4 text-sm text-neutral-500">Waiting for an amount</p>
                )}
              </div>

              <div className="mt-auto w-full pt-6">
                {phase === 'form' && (
                  <Button type="button" size="lg" disabled={!canContinue} onClick={() => setPhase('qr')} className="w-full">
                    {canContinue ? 'Show payment QR' : 'Fill in all details'}
                  </Button>
                )}

                {phase === 'qr' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Scan with any UPI app. Once the payment clears, come back and tap below to let us know.
                    </p>
                    <Button type="button" size="lg" onClick={() => setPhase('verify')} className="w-full">
                      I&rsquo;ve paid
                    </Button>
                  </div>
                )}

                {phase === 'verify' && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">One quick human check before we save the record.</p>
                    <div className="flex justify-center">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                        options={{ action: 'donation' }}
                        onSuccess={(t) => setToken(t)}
                      />
                    </div>
                    {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
                    <Button type="button" size="lg" disabled={!token || submitting} onClick={handleMarkPaid} className="w-full">
                      {submitting ? 'Saving\u2026' : 'Confirm donation'}
                    </Button>
                  </div>
                )}

                {phase === 'done' && (
                  <div className="flex items-start gap-3 rounded-xl bg-secondary p-4 text-left">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">Thank you, {name.trim().split(' ')[0] || 'friend'}.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your &#8377;{amount} donation is logged. We&rsquo;ll reach out on {email.trim().toLowerCase()} if we
                        need to verify anything.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Can&rsquo;t donate right now? That&rsquo;s fine. Sharing VIT RANKS with a friend preparing for VITEEE helps just as much.
          </p>
        </section>

        <section className="container mx-auto mt-16 max-w-5xl px-4 pb-20">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">We&rsquo;re Malabar Matrix.</h2>
              <p className="mt-4 text-muted-foreground">
                A small collective of students, mostly from Kerala, who got tired of paywalled mock tests, shady
                coaching funnels, and basic educational material being harder to find than it should be.
              </p>
              <p className="mt-3 text-muted-foreground">
                So we build, quietly and for free, for anyone preparing for an exam that could change their life.
                This platform is the first of a few things we&rsquo;re putting out.
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((x) => (
                <div key={x.title} className="rounded-2xl border border-border bg-card p-4">
                  <dt className="text-sm font-medium">{x.title}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{x.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
