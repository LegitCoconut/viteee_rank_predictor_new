"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Turnstile } from "@marsidev/react-turnstile";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  feedback: z.string().min(10, {
    message: "Feedback must be at least 10 characters.",
  }),
  token: z.string().min(1, { message: "Please verify you are human." }),
});

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(
    "site key",
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      feedback: "",
      token: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error submitting feedback",
          description: errorData.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[90%] mx-auto md:w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="h-12 md:h-10" placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-[90%] mx-auto md:w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="h-12 md:h-10" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem className="w-[90%] mx-auto md:w-full">
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you think"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto flex justify-center">
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
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !form.watch("token")}
            className="w-auto px-8"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="token"
          render={() => <FormMessage className="text-center" />}
        />
      </form>
    </Form>
  );
}
