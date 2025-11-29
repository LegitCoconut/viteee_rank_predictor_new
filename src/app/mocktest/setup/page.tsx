
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle } from 'lucide-react';

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      agree: false,
      token: '',
    },
  });

  const instructions = [
    'You shall be loaded with 125 questions based on the weightage from previous question papers.',
    'You shall wait till all the 125 questions are loaded and the test is created.',
    'A unique ID will be created for you and will be saved in your browser and will be used to store and retrieve marks and info about the exam.',
    'Clearing of cache will clear all the stored data about the test taken.',
    'You will be allowed to attend the mock test after the verification (this action is taken to avoid bots).',
  ];
  
  const closingRemarks = [
    "If you find any issue with the online test, questions, or technical issues feel free to reach out to vitranks@malabarmatrix.site or through the feedback form.",
    "This application and test environment is made by students of VIT for the good of VITEEE aspirants; please use the platform as a student and help your friends grow with you."
  ];

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    console.log(data);
    // For now, the proceed button does nothing.
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-center">
                Mock Test Setup & Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Instructions:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                   <li className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                      <span>If you find any issue with the online test, questions, or technical issues feel free to reach out to <a href="mailto:vitranks@malabarmatrix.site" className="text-primary underline">vitranks@malabarmatrix.site</a> or through the <Link href="/#feedback" className="text-primary underline">feedback form</Link>.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                      <span>This application and test environment is made by students of VIT for the good of VITEEE aspirants; please use the platform as a student and help your friends grow with you.</span>
                    </li>
                </ul>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stream"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Stream</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MPCEA" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                MPCEA (Mathematics, Physics, Chemistry, English, Aptitude)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="BPCEA" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                BPCEA (Biology, Physics, Chemistry, English, Aptitude)
                              </FormLabel>
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
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I have read and agree to the instructions.
                          </FormLabel>
                           <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col items-center justify-center gap-4">
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
                      disabled={isSubmitting || !form.watch('token') || !form.watch('agree')}
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
