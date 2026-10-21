'use client';

import { useRef, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Sparkles, GraduationCap, ShieldCheck, QrCode, CheckCircle2, Rocket, HandHeart, Coffee, BookOpen, Check } from 'lucide-react';

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
const SPRING = { damping: 26, stiffness: 220 };

type Phase = 'form' | 'qr' | 'verify' | 'done';

// ─── Why Card (with tilt) ────────────────────────────────────────────────────
function WhyCard({
  icon: Icon,
  title,
  body,
  tone,
  index,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  tone: 'coral' | 'mint' | 'sky' | 'lavender';
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), SPRING);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), SPRING);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { mx.set(0); my.set(0); }

  const toneClass: Record<typeof tone, string> = {
    coral: 'bg-coral/10 text-coral border-coral/20',
    mint: 'bg-mint/10 text-mint border-mint/20',
    sky: 'bg-sky/10 text-sky border-sky/20',
    lavender: 'bg-lavender/10 text-lavender border-lavender/20',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="rounded-2xl border border-border/60 bg-background/40 p-4 transition-shadow hover:shadow-lg"
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toneClass[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-semibold tracking-tight">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Tier Card ───────────────────────────────────────────────────────────────
function TierCard({
  icon: Icon,
  amount,
  title,
  body,
  active,
  onClick,
}: {
  icon: React.ElementType;
  amount: number;
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
        active
          ? 'border-coral/60 bg-coral/5 shadow-lg shadow-coral/10'
          : 'border-border/60 bg-card hover:border-coral/40'
      }`}
    >
      {/* Glow blob */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-coral/15 blur-2xl transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-display text-3xl italic text-foreground">
          &#8377;{amount}
        </span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            active
              ? 'bg-coral/20 text-coral'
              : 'bg-gradient-to-br from-coral/10 to-peach/10 text-coral/80'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="relative z-10 mt-3 text-sm font-semibold tracking-tight">{title}</p>
      <p className="relative z-10 mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>

      <div
        className={`relative z-10 mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
          active ? 'text-coral' : 'text-muted-foreground group-hover:text-coral/70'
        }`}
      >
        {active ? (
          <>
            <Check className="h-3 w-3" />
            Selected
          </>
        ) : (
          'Tap to pick'
        )}
      </div>
    </motion.button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
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

  const aboutRef = useRef<HTMLElement>(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: '-60px' });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative isolate flex min-h-[88svh] flex-col items-center justify-center overflow-hidden hero-mesh py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 -left-16 h-[32rem] w-[32rem] rounded-full blur-3xl animate-blob-slow"
              style={{ background: 'radial-gradient(circle, hsl(var(--coral) / 0.55), transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl animate-blob"
              style={{ background: 'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)' }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-blob-fast"
              style={{ background: 'radial-gradient(circle, hsl(var(--lavender) / 0.35), transparent 60%)' }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.92] tracking-tighter text-white"
            >
              Back the{' '}
              <span className="font-display italic gradient-text">builders</span>
              <br />
              behind this platform.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg"
            >
              VIT RANKS is free, ad-free, and always will be. If it helped you
              study - and you can spare the price of a cup of chai - it keeps
              our servers humming and the next feature shipping.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mx-auto mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60"
            >
              {[
                { icon: Users, label: 'Student-built' },
                { icon: ShieldCheck, label: 'No ads, no paywall' },
                { icon: Sparkles, label: 'Genuinely free' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-white/40" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── About Malabar Matrix ─────────────────────────────────────── */}
        <section
          ref={aboutRef}
          className="container mx-auto -mt-12 max-w-5xl px-4 md:-mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.12]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-coral/20 to-peach/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-mint/20 to-sky/20 blur-3xl" />

            <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                  Who we are
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  We&rsquo;re{' '}
                  <span className="font-display italic text-coral">
                    Malabar Matrix
                  </span>
                  .
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  A small collective of students, mostly from Kerala, who got
                  tired of paywalled mock tests, shady coaching funnels, and the
                  basic stuff in education being harder to find than it should
                  be.
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  So we build. Quietly, for free, for anyone preparing for an
                  exam that could change their life. This platform is the first
                  of a few things we&rsquo;re putting out.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <WhyCard index={0} icon={GraduationCap} title="Built by students" body="We know what the grind actually feels like - because we're in it." tone="coral" />
                <WhyCard index={1} icon={Users} title="Free, forever" body="No signup, no paywall, no upsell. The mock tests stay free." tone="mint" />
                <WhyCard index={2} icon={ShieldCheck} title="No data games" body="Your attempts stay on your device. We never sell or trade data." tone="sky" />
                <WhyCard index={3} icon={Rocket} title="More on the way" body="Next up: JEE, NEET, CUET tools. Your support accelerates us." tone="lavender" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Where it goes ────────────────────────────────────────────── */}
        <section className="container mx-auto mt-14 max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
              <HandHeart className="h-5 w-5 text-coral" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                Where the money goes
              </h3>
              <p className="text-sm text-muted-foreground">
                Small sums, directly at the running cost of keeping this live.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <TierCard icon={Coffee} amount={49} title="A cup of chai" body="Keeps one free-tier server alive for a day." active={amount === 49} onClick={() => pickTierAmount(49)} />
            <TierCard icon={BookOpen} amount={199} title="A new mock set" body="Funds licensing a fresh batch of practice questions." active={amount === 199} onClick={() => pickTierAmount(199)} />
            <TierCard icon={Sparkles} amount={499} title="A new feature" body="Unlocks a weekend of development on the next big thing." active={amount === 499} onClick={() => pickTierAmount(499)} />
          </div>
        </section>

        {/* ── Donate form + QR ─────────────────────────────────────────── */}
        <section
          id="donate-form"
          className="container mx-auto mt-16 max-w-5xl px-4 pb-24 scroll-mt-20"
        >
          <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="shimmer-border flex h-full rounded-3xl"
            >
              <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.1]" />
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                    Your details
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    Pick an{' '}
                    <span className="font-display italic text-coral">
                      amount
                    </span>
                    .
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="donor-name" className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="donor-name"
                        placeholder="Arjun Menon"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="donor-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-amount" className="text-sm font-medium">
                        Amount{' '}
                        <span className="text-muted-foreground">(INR)</span>
                      </Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg italic text-muted-foreground">
                          &#8377;
                        </span>
                        <Input
                          id="donor-amount"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          placeholder="49"
                          value={amountStr}
                          onChange={(e) =>
                            setAmountStr(e.target.value.replace(/[^0-9]/g, ''))
                          }
                          className="h-11 rounded-xl pl-9"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {SUGGESTED.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setAmountStr(String(v))}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              amount === v
                                ? 'border-coral bg-coral/15 text-coral'
                                : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60'
                            }`}
                          >
                            &#8377;{v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* QR + confirm card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-xl md:p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-coral/15 to-peach/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-mint/15 to-sky/15 blur-3xl" />

              <div className="relative z-10 flex flex-1 flex-col items-center text-center">
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {amount > 0 ? `Pay ₹${amount}` : 'Your QR'}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {amount > 0
                    ? 'GPay · PhonePe · Paytm · BHIM - any UPI app'
                    : 'Enter an amount above to reveal the QR code'}
                </p>

                <div className="relative mt-6 h-64 w-64">
                  {/* Decorative spinning frame */}
                  <div
                    className={`pointer-events-none absolute -inset-3 rounded-3xl transition-opacity duration-500 ${
                      amount > 0 ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{
                      background:
                        'conic-gradient(from var(--angle,0deg), hsl(var(--coral)), hsl(var(--peach)), hsl(var(--mint)), hsl(var(--lavender)), hsl(var(--coral)))',
                      padding: '2px',
                      WebkitMask:
                        'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      animation: 'spin-angle 6s linear infinite',
                      borderRadius: '1.5rem',
                    }}
                  />

                  <AnimatePresence mode="wait">
                    {amount > 0 && upiLink ? (
                      <motion.div
                        key={`qr-${amount}`}
                        initial={{ opacity: 0, scale: 0.82, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-4 shadow-2xl shadow-coral/10"
                      >
                        <QRCodeSVG
                          value={upiLink}
                          size={224}
                          bgColor="#ffffff"
                          fgColor="#0b0520"
                          level="M"
                          includeMargin={false}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 p-4 shadow-xl"
                      >
                        <div className="relative h-full w-full">
                          <div
                            className="absolute inset-0 rounded-xl"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle at 20% 20%, #0b0520 3px, transparent 4px), radial-gradient(circle at 80% 20%, #0b0520 3px, transparent 4px), radial-gradient(circle at 20% 80%, #0b0520 3px, transparent 4px), linear-gradient(45deg, #0b0520 25%, transparent 25%, transparent 75%, #0b0520 75%, #0b0520), linear-gradient(-45deg, #0b0520 25%, transparent 25%, transparent 75%, #0b0520 75%, #0b0520)',
                              backgroundSize: '40px 40px, 40px 40px, 40px 40px, 8px 8px, 8px 8px',
                              filter: 'blur(10px)',
                              opacity: 0.5,
                            }}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                            <Sparkles className="h-6 w-6 text-coral" />
                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                              Awaiting amount
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-auto w-full pt-6">
                  <AnimatePresence mode="wait">
                    {phase === 'form' && (
                      <motion.div
                        key="generate"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          type="button"
                          size="lg"
                          disabled={!canContinue}
                          onClick={() => setPhase('qr')}
                          className="shimmer-border group h-12 w-full gap-2 rounded-full bg-gradient-to-r from-coral to-peach text-base font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <QrCode className="h-4 w-4" />
                          {canContinue ? 'Generate QR' : 'Fill all fields above'}
                        </Button>
                      </motion.div>
                    )}

                    {phase === 'qr' && (
                      <motion.div
                        key="paid-cta"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-muted-foreground">
                          Scan the code with any UPI app. Once the payment
                          clears, come back and tap below to let us know.
                        </p>
                        <Button
                          type="button"
                          size="lg"
                          onClick={() => setPhase('verify')}
                          className="group h-12 w-full gap-2 rounded-full bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          I&rsquo;ve paid
                        </Button>
                      </motion.div>
                    )}

                    {phase === 'verify' && (
                      <motion.div
                        key="verify"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-muted-foreground">
                          One quick human check before we save the record.
                        </p>
                        <div className="flex justify-center">
                          <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                            options={{ action: 'donation' }}
                            onSuccess={(t) => setToken(t)}
                          />
                        </div>
                        {errorMsg && (
                          <p className="text-xs text-destructive">{errorMsg}</p>
                        )}
                        <Button
                          type="button"
                          size="lg"
                          disabled={!token || submitting}
                          onClick={handleMarkPaid}
                          className="shimmer-border group h-12 w-full gap-2 rounded-full bg-gradient-to-r from-mint to-sky text-base font-semibold text-plum-deep shadow-lg shadow-mint/20 hover:from-mint hover:to-sky disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {submitting ? 'Saving…' : 'Confirm donation'}
                        </Button>
                      </motion.div>
                    )}

                    {phase === 'done' && (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="rounded-2xl border border-mint/40 bg-mint/10 p-5 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-mint" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Thank you, {name.trim().split(' ')[0] || 'friend'}.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Your &#8377;{amount} donation is logged. We&rsquo;ll
                              reach out on {email.trim().toLowerCase()} if we need
                              to verify anything. Seriously - thank you.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Non-donor note */}
          <div className="mt-12 rounded-2xl border border-dashed border-border/60 bg-muted/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Can&rsquo;t donate right now? Totally fine. Share VIT RANKS with a
              friend preparing for VITEEE - that helps us just as much.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
