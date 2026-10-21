import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, FlaskConical, Calculator, Brain, Languages } from "lucide-react";

const mpceaData = [
  { subject: "Mathematics", questions: 40, minutes: "50", icon: Calculator },
  { subject: "Physics", questions: 25, minutes: "30", icon: BookOpen },
  { subject: "Chemistry", questions: 25, minutes: "30", icon: FlaskConical },
  { subject: "English", questions: 5, minutes: "10 (with Aptitude)", icon: Languages },
  { subject: "Aptitude", questions: 5, minutes: "", icon: Brain },
];

const bpceaData = [
  { subject: "Biology", questions: 40, minutes: "50", icon: BookOpen },
  { subject: "Physics", questions: 25, minutes: "30", icon: BookOpen },
  { subject: "Chemistry", questions: 25, minutes: "30", icon: FlaskConical },
  { subject: "English", questions: 5, minutes: "10 (with Aptitude)", icon: Languages },
  { subject: "Aptitude", questions: 5, minutes: "", icon: Brain },
];

export function MockTestPattern() {
  return (
    <section className="py-12 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3 md:mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            Exam Structure
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline tracking-tighter font-semibold">
            VITEEE Exam Pattern
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto px-2">
            Understand the structure of the VITEEE for both MPCEA and BPCEA streams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
              <CardTitle className="text-center text-xl font-semibold">MPCEA Stream</CardTitle>
              <p className="text-center text-sm text-muted-foreground">Mathematics Group</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Subject</TableHead>
                    <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Questions</TableHead>
                    <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Minutes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mpceaData.map((row) => (
                    <TableRow key={row.subject}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-secondary">
                            <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm">{row.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{row.questions}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{row.minutes}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-primary/5 font-semibold">
                    <TableCell className="text-sm">Total</TableCell>
                    <TableCell className="text-right text-primary text-sm">100</TableCell>
                    <TableCell className="text-right text-primary text-sm">120</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
              <CardTitle className="text-center text-xl font-semibold">BPCEA Stream</CardTitle>
              <p className="text-center text-sm text-muted-foreground">Biology Group</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Subject</TableHead>
                    <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Questions</TableHead>
                    <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Minutes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bpceaData.map((row) => (
                    <TableRow key={row.subject}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-secondary">
                            <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm">{row.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{row.questions}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{row.minutes}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-primary/5 font-semibold">
                    <TableCell className="text-sm">Total</TableCell>
                    <TableCell className="text-right text-primary text-sm">100</TableCell>
                    <TableCell className="text-right text-primary text-sm">120</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 md:mt-10 flex justify-center px-2">
          <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Exam Duration</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">2 Hours &middot; fixed time per section &middot; Online CBT Mode</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
