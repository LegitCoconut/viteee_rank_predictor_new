"use client";

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Question, Answer } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QuestionSidebarProps {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

const subjectOrder = ['maths', 'physics', 'chemistry', 'apt_eng'];
const subjectNames: { [key: string]: string } = {
  maths: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  apt_eng: 'Aptitude & English'
};

export function QuestionSidebar({ questions, answers, currentQuestionIndex, onQuestionSelect }: QuestionSidebarProps) {

  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    const currentSubject = questions[currentQuestionIndex]?.subject;
    if (currentSubject) {
      setActiveAccordionItem(currentSubject);
    }
  }, [currentQuestionIndex, questions]);


  const groupedQuestions: { [key: string]: { question: Question, originalIndex: number }[] } = {};

  questions.forEach((q, index) => {
    if (!groupedQuestions[q.subject]) {
      groupedQuestions[q.subject] = [];
    }
    groupedQuestions[q.subject].push({ question: q, originalIndex: index });
  });

  // Calculate Stats
  const stats = {
    visited: answers.filter(a => a.visited).length,
    notVisited: answers.filter(a => !a.visited).length,
    answered: answers.filter(a => a.status === 'answered').length,
    notAnswered: answers.filter(a => a.status === 'unanswered' && a.visited).length, // Visited but not answered
    marked: answers.filter(a => a.status === 'marked').length,
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 text-xs p-2 border rounded-md bg-muted/50">
        <div className="flex justify-between"><span>Visited:</span> <span className="font-bold">{stats.visited}</span></div>
        <div className="flex justify-between"><span>Not Visited:</span> <span className="font-bold">{stats.notVisited}</span></div>
        <div className="flex justify-between"><span>Answered:</span> <span className="font-bold text-green-600">{stats.answered}</span></div>
        <div className="flex justify-between"><span>Not Answered:</span> <span className="font-bold text-red-500">{stats.notAnswered}</span></div>
        <div className="flex justify-between col-span-2"><span>Marked:</span> <span className="font-bold text-yellow-600">{stats.marked}</span></div>
      </div>
      <ScrollArea className="flex-1">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeAccordionItem}
          onValueChange={setActiveAccordionItem}
        >
          {subjectOrder.map(subjectKey => (
            groupedQuestions[subjectKey] && (
              <AccordionItem value={subjectKey} key={subjectKey}>
                <AccordionTrigger className="text-sm py-2 hover:no-underline">{subjectNames[subjectKey]}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {groupedQuestions[subjectKey].map(({ originalIndex }) => {
                      const answer = answers[originalIndex];
                      const answerStatus = answer.status;
                      const isVisited = answer.visited;

                      return (
                        <Button
                          key={originalIndex}
                          variant={
                            originalIndex === currentQuestionIndex ? 'default' :
                              answerStatus === 'answered' ? 'secondary' :
                                answerStatus === 'marked' ? 'outline' :
                                  'ghost'
                          }
                          className={cn(
                            "h-10 w-10 p-0 text-center relative",
                            answerStatus === 'answered' && "bg-green-200 dark:bg-green-800 text-foreground",
                            answerStatus === 'marked' && "border-yellow-500 text-yellow-500",
                            !isVisited && "opacity-50"
                          )}
                          onClick={() => onQuestionSelect(originalIndex)}
                        >
                          {originalIndex + 1}
                        </Button>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
