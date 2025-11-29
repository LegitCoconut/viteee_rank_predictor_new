import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Download } from "lucide-react";
  import Link from "next/link";
  import { Card, CardContent } from "@/components/ui/card";
  
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
      <section className="py-12 md:py-20">
        <div className="container px-4 text-center">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">Syllabus Downloads</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Download the official VITEEE syllabus PDFs for each subject.
                </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Download</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {syllabusFiles.map((file) => (
                        <TableRow key={file.subject}>
                        <TableCell className="font-medium">{file.subject}</TableCell>
                        <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm" onClick={trackDownload}>
                            <Link href={file.path} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                PDF
                            </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
              </Card>
            </div>
        </div>
      </section>
    );
  }
  