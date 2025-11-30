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

  return (
    <ScrollArea className="h-full">
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
                                const answerStatus = answers[originalIndex].status;
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
                                        "h-10 w-10 p-0 text-center",
                                        answerStatus === 'answered' && "bg-green-200 dark:bg-green-800 text-foreground",
                                        answerStatus === 'marked' && "border-yellow-500 text-yellow-500",
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
  );
}
