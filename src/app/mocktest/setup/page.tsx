'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  Info,
  User,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Clock,
  HelpCircle,
  Server,
  Sparkles,
  Mail,
  ChevronRight,
} from 'lucide-react';
import type { PredefinedMockTestSummary } from '@/lib/types';

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    stream: z.enum(['MPCEA', 'BPCEA'], {
      required_error: 'You need to select a stream.',
    }),
    agree: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the instructions to continue.',
    }),
    subscribe: z.boolean().optional().default(false),
    subscribeEmail: z.string().optional().default(''),
    token: z.string().min(1, { message: 'Please verify you are human.' }),
  })
  .superRefine((data, ctx) => {
    if (data.subscribe) {
      const emailOk = z.string().email().safeParse(data.subscribeEmail).success;
      if (!emailOk) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['subscribeEmail'],
          message: 'Enter a valid email to subscribe.',
        });
      }
    }
  });

export default function MockTestSetupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawMode = searchParams.get('mode');
  const rawId = searchParams.get('id');
  const mode: 'random' | 'predefined' = rawMode === 'predefined' ? 'predefined' : 'random';
  const predefinedId = useMemo(() => {
    if (mode !== 'predefined') return null;
    const n = Number(rawId);
    return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
  }, [mode, rawId]);

  const [predefinedName, setPredefinedName] = useState<string | null>(null);
  const [modeValidated, setModeValidated] = useState(mode === 'random');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('mockTestSubscribed') === 'true') {
        setAlreadySubscribed(true);
      }
    } catch {
      // localStorage unavailable; treat as not subscribed
    }
  }, []);

  useEffect(() => {
    if (mode === 'random') {
      setModeValidated(true);
      return;
    }
    if (!predefinedId) {
      router.replace('/mocktest');
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/mocktest/predefined');
        const list: PredefinedMockTestSummary[] = await res.json();
        const slot = list.find((s) => s.id === predefinedId);
        if (!slot || !slot.active) {
          router.replace('/mocktest');
          return;
        }
        setPredefinedName(slot.name);
        setModeValidated(true);
      } catch {
        router.replace('/mocktest');
      }
    })();
  }, [mode, predefinedId, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      stream: 'MPCEA',
      agree: false,
      subscribe: false,
      subscribeEmail: '',
      token: '',
    },
  });

  const instructions = [
    {
      icon: HelpCircle,
      title: '125 questions, VITEEE-weighted',
      text: 'The question set mirrors the actual VITEEE paper weightage — Physics, Chemistry, Mathematics, Aptitude & English.',
    },
    {
      icon: Clock,
      title: 'Wait for the full load',
      text: 'Please wait until all 125 questions finish loading and the test is fully created before you start.',
    },
    {
      icon: User,
      title: 'Anonymous, browser-local',
      text: 'A unique ID is created in your browser to save progress and results. No signup, nothing on our servers tied to you.',
    },
    {
      icon: Info,
      title: 'Don\u2019t clear your browser',
      text: 'Clearing cache or switching browsers will wipe your local test history and results.',
    },
    {
      icon: ShieldCheck,
      title: 'One quick human check',
      text: 'You\u2019ll complete a Cloudflare Turnstile verification to prevent bot abuse — it\u2019s invisible to you most of the time.',
    },
    {
      icon: Server,
      title: 'Free-tier infrastructure',
      text: 'This platform runs on free-tier servers to stay ad-free. First load may take a few extra seconds — thank you for your patience.',
    },
  ];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    fetch('/api/analytics/mocktest-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);

    if (data.subscribe && data.subscribeEmail) {
      fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.subscribeEmail,
          name: data.name,
          source: 'mocktest-setup',
        }),
      }).catch(() => {
        /* silent */
      });
      try {
        localStorage.setItem('mockTestSubscribed', 'true');
      } catch {
        // ignore
      }
    }

    const setupPayload = {
      ...data,
      mode,
      ...(mode === 'predefined' && predefinedId
        ? { predefinedId, predefinedName: predefinedName ?? `Mock Test ${predefinedId}` }
        : {}),
    };
    sessionStorage.setItem('mockTestSetup', JSON.stringify(setupPayload));
    router.push('/mocktest/start');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="relative isolate overflow-hidden hero-mesh py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl animate-blob-slow"
              style={{ background: 'radial-gradient(circle, hsl(var(--coral) / 0.5), transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 h-[26rem] w-[26rem] rounded-full blur-3xl animate-blob"
              style={{ background: 'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)' }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-white/55">
              <Link href="/mocktest" className="transition hover:text-white/80">
                Mock tests
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/80">
                {mode === 'predefined' && predefinedName ? predefinedName : 'Random mock'}
              </span>
            </div>

            {mode === 'predefined' && predefinedName && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-coral"
              >
                {predefinedName}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter text-white"
            >
              Before you{' '}
              <span className="font-display italic gradient-text">begin</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-5 max-w-xl text-base text-white/70 md:text-lg"
            >
              Read the house rules, fill in a couple of details, and you&rsquo;re
              ready to sit down with 125 questions and a 2.5-hour clock.
            </motion.p>
          </div>
        </section>

        <div className="container mx-auto max-w-4xl space-y-12 px-4 py-14 md:py-20">
          {/* Instructions */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
                <Info className="h-5 w-5 text-coral" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Instructions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Six quick things worth knowing.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {instructions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-coral/10 to-peach/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-4 w-4 text-coral" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tracking-tight">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-coral" />
                <span>
                  Broken question, a bug, or a feature idea? Write to{' '}
                  <a
                    href="mailto:vitranks@malabarmatrix.site"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-coral"
                  >
                    vitranks@malabarmatrix.site
                  </a>{' '}
                  or use the{' '}
                  <Link
                    href="/#feedback"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-coral"
                  >
                    feedback form
                  </Link>
                  . Built by VIT students, for VITEEE aspirants — please use it
                  responsibly.
                </span>
              </p>
            </div>
          </section>

          {/* Your Details */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-sky/20">
                <User className="h-5 w-5 text-mint" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Your details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Just a name and a stream — that&rsquo;s it.
                </p>
              </div>
            </div>

            <div className="shimmer-border rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.12]" />
                <div className="relative z-10">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Full name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Arjun Menon"
                                className="h-11 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stream"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Stream
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2"
                              >
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <label className="group/option flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-border/70 p-4 transition-all hover:border-coral/50 hover:bg-coral/5 has-[[data-state=checked]]:border-coral has-[[data-state=checked]]:bg-coral/10 has-[[data-state=checked]]:shadow-sm">
                                    <FormControl>
                                      <RadioGroupItem value="MPCEA" />
                                    </FormControl>
                                    <div>
                                      <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                                        MPCEA
                                        <Sparkles className="h-3 w-3 text-coral opacity-0 transition-opacity group-has-[[data-state=checked]]/option:opacity-100" />
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Maths, Physics, Chemistry, English,
                                        Aptitude
                                      </p>
                                    </div>
                                  </label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <label className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 opacity-60">
                                    <FormControl>
                                      <RadioGroupItem value="BPCEA" disabled />
                                    </FormControl>
                                    <div>
                                      <p className="text-sm font-semibold tracking-tight">
                                        BPCEA
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Biology stream · Coming Soon
                                      </p>
                                    </div>
                                  </label>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="agree"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-border/60 bg-muted/30 p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer text-sm">
                                I&apos;ve read and I agree to the instructions
                                above.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      {!alreadySubscribed && (
                        <>
                          <FormField
                            control={form.control}
                            name="subscribe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-coral/30 bg-coral/5 p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);
                                      if (!checked) {
                                        form.setValue('subscribeEmail', '');
                                        form.clearErrors('subscribeEmail');
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer text-sm">
                                    <span className="inline-flex items-center gap-1.5 font-semibold">
                                      <Mail className="h-3.5 w-3.5 text-coral" />
                                      Email me when new mock tests drop
                                    </span>{' '}
                                    <span className="font-normal text-muted-foreground">
                                      (optional, no spam)
                                    </span>
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          {form.watch('subscribe') && (
                            <FormField
                              control={form.control}
                              name="subscribeEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Email address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="you@example.com"
                                      className="h-11 rounded-xl"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </>
                      )}

                      <div className="flex flex-col items-center gap-5 pt-2">
                        <FormField
                          control={form.control}
                          name="token"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Turnstile
                                  siteKey={
                                    process.env
                                      .NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!
                                  }
                                  onSuccess={(token) => {
                                    field.onChange(token);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          size="lg"
                          className="shimmer-border group h-12 w-full gap-2 rounded-full bg-gradient-to-r from-coral to-peach px-8 text-base font-semibold text-plum-deep shadow-lg shadow-coral/20 hover:from-coral hover:to-peach sm:w-auto"
                          disabled={
                            !modeValidated ||
                            isSubmitting ||
                            !form.watch('token') ||
                            !form.watch('agree') ||
                            form.formState.isSubmitting
                          }
                        >
                          {isSubmitting ? (
                            'Preparing your test\u2026'
                          ) : (
                            <>
                              Start mock test
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          125 questions · 2.5 hours · instant results
                        </p>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
