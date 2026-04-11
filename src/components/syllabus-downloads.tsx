import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileDown } from "lucide-react";
import Link from "next/link";

const syllabusFiles = [
  { subject: "Physics", path: "https://vit.ac.in/sites/default/files/VITEEE-2026/Physics_VITEEE2026.pdf" },
  { subject: "Chemistry", path: "https://vit.ac.in/sites/default/files/VITEEE-2026/Chemistry_VITEEE2026.pdf" },
  { subject: "Mathematics", path: "https://vit.ac.in/sites/default/files/VITEEE-2026/Maths_VITEEE2026.pdf" },
  { subject: "Biology", path: "https://vit.ac.in/sites/default/files/VITEEE-2026/Biology_VITEEE2026.pdf" },
  { subject: "Aptitude & English", path: "https://vit.ac.in/sites/default/files/VITEEE-2026/English_and_Aptitude_VITEEE2026.pdf" },
];

const trackDownload = () => {
  fetch('/api/analytics/syllabus-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'syllabus_download' })
  }).catch(console.error);
};

export function SyllabusDownloads() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <FileDown className="h-3.5 w-3.5" />
            Official PDFs
          </div>
          <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">
            Syllabus Downloads
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Download the official VITEEE 2026 syllabus PDFs for each subject.
          </p>
        </div>

        <div className="grid gap-3 max-w-2xl mx-auto">
          {syllabusFiles.map((file) => (
            <Card key={file.subject} className="border-border/50 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-500/10">
                    <FileDown className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.subject}</p>
                    <p className="text-xs text-muted-foreground">VITEEE 2026 Syllabus PDF</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-2 h-9" onClick={trackDownload}>
                  <Link href={file.path} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
