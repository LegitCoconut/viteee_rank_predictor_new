"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { syllabus } from "@/lib/data/syllabus-data";
import { Button } from "@/components/ui/button";
import { BookMarked, Download, GraduationCap } from "lucide-react";

const PDF_BASE = "https://vit.ac.in/sites/default/files/VITEEE-2027";
const syllabusPdfs: Record<string, string> = {
  Physics: "Physics_VITEEE2027.pdf",
  Chemistry: "Chemistry_VITEEE2027.pdf",
  Mathematics: "Maths_VITEEE2027.pdf",
  Biology: "Biology_VITEEE2027.pdf",
  Aptitude: "English_and_Aptitude_VITEEE2027.pdf",
  English: "English_and_Aptitude_VITEEE2027.pdf",
};

const trackDownload = () => {
  fetch("/api/analytics/syllabus-download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "syllabus_download" }),
  }).catch(console.error);
};

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
              <AccordionItem key={subject.subject} value={subject.subject} className="relative border rounded-lg px-4 data-[state=open]:bg-muted/20">
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
                {syllabusPdfs[subject.subject] && (
                  // Sibling of the trigger (not inside it) so the link isn't nested in a button.
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="absolute right-12 top-[18px] h-8 gap-1.5 px-2.5 sm:px-3"
                    onClick={trackDownload}
                  >
                    <a
                      href={`${PDF_BASE}/${syllabusPdfs[subject.subject]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${subject.subject} syllabus PDF`}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </a>
                  </Button>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
