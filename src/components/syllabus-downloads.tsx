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
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  
  const syllabusFiles = [
    { subject: "Physics", path: "/syllabus/phy.pdf" },
    { subject: "Chemistry", path: "/syllabus/che.pdf" },
    { subject: "Mathematics", path: "/syllabus/math.pdf" },
    { subject: "Biology", path: "/syllabus/bio.pdf" },
    { subject: "Aptitude & English", path: "/syllabus/apt_eng.pdf" },
  ];
  
  export function SyllabusDownloads() {
    return (
      <section className="py-12 md:py-20">
        <div className="container px-4">
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
                            <Button asChild variant="outline" size="sm">
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
  