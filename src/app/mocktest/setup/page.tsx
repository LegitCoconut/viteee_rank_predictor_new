'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
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
import { Card, CardContent } from '@/components/ui/card';
import { Turnstile } from '@marsidev/react-turnstile';
import { Info, User, BookOpen, ShieldCheck, ArrowRight, Clock, HelpCircle, Server } from 'lucide-react';
import type { PredefinedMockTestSummary } from '@/lib/types';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  stream: z.enum(['MPCEA', 'BPCEA'], {
    required_error: 'You need to select a stream.',
  }),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the instructions to continue.',
  }),
  token: z.string().min(1, { message: 'Please verify you are human.' }),
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
        const slot = list.find(s => s.id === predefinedId);
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
      token: '',
    },
  });

  const instructions = [
    {
      icon: HelpCircle,
      text: 'You will be loaded with 125 questions based on the weightage from previous question papers.',
    },
    {
      icon: Clock,
      text: 'Please wait till all 125 questions are loaded and the test is created.',
    },
    {
      icon: User,
      text: 'A unique ID will be created and saved in your browser to store and retrieve your exam data.',
    },
    {
      icon: Info,
      text: 'Clearing your browser cache will remove all stored data about tests taken.',
    },
    {
      icon: ShieldCheck,
      text: 'You will need to complete a verification step to prevent bot access.',
    },
    {
      icon: Server,
      text: 'This platform runs on free-tier servers to keep it ad-free. The test may take a moment to load.',
    },
  ];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    // Fire-and-forget analytics tracking
    fetch('/api/analytics/mocktest-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);

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
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-b">
          <div className="container max-w-4xl mx-auto px-4 py-10 text-center">
            {mode === 'predefined' && predefinedName && (
              <p className="text-sm uppercase tracking-wider text-primary font-medium mb-2">{predefinedName}</p>
            )}
            <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight mb-2">
              Before You Begin
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Review the instructions below, fill in your details, and start your mock test.
            </p>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* Instructions */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold font-headline">Instructions</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {instructions.map((item, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-secondary flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Extra notes */}
            <div className="mt-4 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
              <p>
                If you find any issues with the test, questions, or technical problems, feel free to reach out at{' '}
                <a href="mailto:vitranks@malabarmatrix.site" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  vitranks@malabarmatrix.site
                </a>{' '}
                or through the{' '}
                <Link href="/#feedback" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  feedback form
                </Link>.
              </p>
              <p>
                This platform is built by VIT students for VITEEE aspirants. Please use it responsibly and help your friends grow with you.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold font-headline">Your Details</h2>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" className="h-11" {...field} />
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
                          <FormLabel className="text-sm font-medium">Select Stream</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                            >
                              <FormItem className="flex items-center space-x-0 space-y-0">
                                <label className="flex items-center gap-3 w-full cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                  <FormControl>
                                    <RadioGroupItem value="MPCEA" />
                                  </FormControl>
                                  <div>
                                    <p className="font-medium text-sm">MPCEA</p>
                                    <p className="text-xs text-muted-foreground">Maths, Physics, Chemistry, English, Aptitude</p>
                                  </div>
                                </label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-0 space-y-0">
                                <label className="flex items-center gap-3 w-full rounded-lg border p-4 opacity-50 cursor-not-allowed">
                                  <FormControl>
                                    <RadioGroupItem value="BPCEA" disabled />
                                  </FormControl>
                                  <div>
                                    <p className="font-medium text-sm">BPCEA</p>
                                    <p className="text-xs text-muted-foreground">Biology stream &middot; Coming Soon</p>
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/50 bg-muted/30 p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm cursor-pointer">
                              I have read and agree to the instructions above.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col items-center gap-5 pt-2">
                      <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Turnstile
                                siteKey={
                                  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!
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
                        className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/20 w-full sm:w-auto"
                        disabled={!modeValidated || isSubmitting || !form.watch('token') || !form.watch('agree') || form.formState.isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Start Mock Test'}
                        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
