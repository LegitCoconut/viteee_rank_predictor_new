"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CollegeData, viteeeData } from "@/lib/viteee-data";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, University, BookOpen, BarChart } from "lucide-react";

const FormSchema = z.object({
  rank: z.coerce
    .number({
      required_error: "Rank is required.",
      invalid_type_error: "Rank must be a number.",
    })
    .int()
    .positive("Rank must be a positive number.")
    .max(150000, "Rank seems too high. Please check."),
});

export function RankPredictor() {
  const [results, setResults] = useState<CollegeData[]>([]);
  const [searched, setSearched] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rank: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const userRank = data.rank;
    const eligibleColleges = viteeeData.filter(
      (college) => college.rank >= userRank
    );
    const sortedColleges = eligibleColleges.sort((a, b) => a.rank - b.rank);
    setResults(sortedColleges);
    setSearched(true);
  }

  return (
    <section id="rank-predictor-section" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              Check Your Eligibility
            </CardTitle>
            <CardDescription>
              Enter your VITEEE rank to see a list of available campuses and programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row items-start gap-4 mb-8"
              >
                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-auto flex-grow">
                      <FormLabel>Your VITEEE Rank</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="sm:self-end mt-2 sm:mt-0 w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Predict
                </Button>
              </form>
            </Form>

            <AnimatePresence>
              {searched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {results.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead><University className="inline-block mr-2 h-4 w-4" />Campus</TableHead>
                            <TableHead><BookOpen className="inline-block mr-2 h-4 w-4" />Program</TableHead>
                            <TableHead className="text-right"><BarChart className="inline-block mr-2 h-4 w-4" />Closing Rank</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.college}</TableCell>
                              <TableCell>{result.program}</TableCell>
                              <TableCell className="text-right font-mono">{result.rank.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                      <h3 className="text-lg font-semibold text-muted-foreground">No results found for this rank.</h3>
                      <p className="text-sm text-muted-foreground mt-1">You may still have options through other quotas or counseling rounds.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {!searched && (
               <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg bg-secondary/50">
                  <h3 className="text-lg font-semibold text-muted-foreground">Your future awaits.</h3>
                  <p className="text-sm text-muted-foreground mt-1">Enter your rank above to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
