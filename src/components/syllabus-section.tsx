"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { syllabus } from "@/lib/data/syllabus-data";
import { BookMarked } from "lucide-react";

export function SyllabusSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">
            VITEEE Syllabus
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore the detailed syllabus for each subject in the VITEEE.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {syllabus.map((subject) => (
              <AccordionItem key={subject.subject} value={subject.subject}>
                <AccordionTrigger className="text-xl font-bold">
                    <div className="flex items-center gap-3">
                        <BookMarked className="h-6 w-6 text-primary" />
                        <span>{subject.subject}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm sm:prose-base max-w-none dark:prose-invert py-4">
                  {subject.topics.map((topic, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-semibold text-lg text-foreground">{topic.title}</h3>
                      <p className="text-muted-foreground">{topic.content}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
