import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const mpceaData = [
  { subject: "Mathematics", questions: 40 },
  { subject: "Physics", questions: 35 },
  { subject: "Chemistry", questions: 35 },
  { subject: "English", questions: 5 },
  { subject: "Aptitude", questions: 10 },
];

const bpceaData = [
  { subject: "Biology", questions: 40 },
  { subject: "Physics", questions: 35 },
  { subject "Chemistry", questions: 35 },
  { subject: "English", questions: 5 },
  { subject: "Aptitude", questions: 10 },
];

export function MockTestPattern() {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">
            VITEEE Exam Pattern
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Understand the structure of the VITEEE for both MPCEA and BPCEA streams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">MPCEA</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="text-right font-semibold">No. of Questions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mpceaData.map((row) => (
                    <TableRow key={row.subject}>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell className="text-right">{row.questions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">BPCEA</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="text-right font-semibold">No. of Questions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bpceaData.map((row) => (
                    <TableRow key={row.subject}>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell className="text-right">{row.questions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center gap-2 text-lg font-medium bg-secondary text-secondary-foreground p-4 rounded-lg">
                <Clock className="h-5 w-5" />
                <span>Exam Duration: 2 Hours and 30 Minutes</span>
            </div>
        </div>
      </div>
    </section>
  );
}
