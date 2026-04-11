"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { syllabus } from "@/lib/data/syllabus-data";
import { BookMarked, GraduationCap } from "lucide-react";

export function SyllabusSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <GraduationCap className="h-3.5 w-3.5" />
            Complete Syllabus
          </div>
          <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">
            VITEEE Syllabus
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Explore the detailed syllabus for each subject in the VITEEE.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {syllabus.map((subject) => (
              <AccordionItem key={subject.subject} value={subject.subject} className="border rounded-lg px-4 data-[state=open]:bg-muted/20">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                      <BookMarked className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <span>{subject.subject}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="pl-12 space-y-4">
                    {subject.topics.map((topic, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <h3 className="font-semibold text-sm text-foreground">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{topic.content}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
