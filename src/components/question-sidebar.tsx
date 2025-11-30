"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Question, Answer } from '@/lib/types';

interface QuestionSidebarProps {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

export function QuestionSidebar({ questions, answers, currentQuestionIndex, onQuestionSelect }: QuestionSidebarProps) {
  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-5 gap-2 pr-4">
        {questions.map((_, index) => {
          const answerStatus = answers[index].status;
          return (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex ? 'default' :
                answerStatus === 'answered' ? 'secondary' :
                answerStatus === 'marked' ? 'outline' :
                'ghost'
              }
              className={cn(
                "h-10 w-10 p-0 text-center",
                answerStatus === 'answered' && "bg-green-200 dark:bg-green-800 text-foreground",
                answerStatus === 'marked' && "border-yellow-500 text-yellow-500",
              )}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </Button>
          )
        })}
      </div>
    </ScrollArea>
  );
}
