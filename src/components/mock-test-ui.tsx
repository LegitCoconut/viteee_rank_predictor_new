"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { QuestionSidebar } from '@/components/question-sidebar';
import { Timer } from '@/components/timer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import type { Question, Answer } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from './ui/skeleton';

interface MockTestUIProps {
  questions: Question[];
  setupData: { name: string; stream: string };
}

export function MockTestUI({ questions, setupData }: MockTestUIProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map(q => ({ questionId: q._id, answer: null, status: 'unanswered' }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const elem = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const openFullscreen = () => {
    if (elem.current) {
      if (elem.current.requestFullscreen) {
        elem.current.requestFullscreen();
      } else if ((elem.current as any).webkitRequestFullscreen) {
        (elem.current as any).webkitRequestFullscreen();
      } else if ((elem.current as any).msRequestFullscreen) {
        (elem.current as any).msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    openFullscreen();
  }, []);

  const handleAnswerSelect = (option: 'a' | 'b' | 'c' | 'd') => {
    setAnswers(prev =>
      prev.map((ans, index) =>
        index === currentQuestionIndex ? { ...ans, answer: option, status: 'answered' } : ans
      )
    );
  };
  
  const handleQuestionSelect = (index: number) => {
    if (index !== currentQuestionIndex) {
        setIsImageLoading(true);
        setCurrentQuestionIndex(index);
    }
  };

  const handleMarkForReview = () => {
    setAnswers(prev =>
      prev.map((ans, index) =>
        index === currentQuestionIndex ? { ...ans, status: ans.status === 'marked' ? (ans.answer ? 'answered' : 'unanswered') : 'marked' } : ans
      )
    );
  };
  
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    let score = 0;
    const sectionScores: Record<string, { score: number; total: number }> = {
        maths: { score: 0, total: 0 },
        physics: { score: 0, total: 0 },
        chemistry: { score: 0, total: 0 },
        apt_english: { score: 0, total: 0 },
    };

    questions.forEach((question, index) => {
        const subjectKey = question.subject;
        if (sectionScores[subjectKey]) {
            sectionScores[subjectKey].total++;
            if (answers[index].answer === question.correct_option) {
                sectionScores[subjectKey].score++;
                score++;
            }
        }
    });

    const examResult = {
      examId: uuidv4(),
      userId: setupData.name,
      stream: setupData.stream,
      answers,
      score: score,
      totalQuestions: questions.length,
      sectionScores,
      timestamp: new Date().toISOString(),
    };

    try {
      const pastResults = JSON.parse(localStorage.getItem('mockTestResults') || '[]');
      pastResults.push(examResult);
      localStorage.setItem('mockTestResults', JSON.stringify(pastResults));

      await fetch('/api/mocktest/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examResult),
      });

    } catch (error) {
        console.error("Failed to save results:", error);
    } finally {
        sessionStorage.setItem('latestResult', JSON.stringify(examResult));
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        router.push('/mocktest/results');
    }
  }, [answers, questions, setupData, router, isSubmitting]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div ref={elem} className="w-full h-full bg-background p-4 flex flex-col md:flex-row gap-4 overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-start p-4 border rounded-lg bg-card gap-4 overflow-y-auto">
        <div className="w-full flex-1 flex items-center justify-center min-h-0">
            {isImageLoading && <Skeleton className="w-full h-64 md:h-96" />}
            {currentQuestion && (
                <Image 
                    key={currentQuestion._id}
                    src={`/api/mocktest/image/${currentQuestion.image_id}`}
                    alt={`Question ${currentQuestionIndex + 1}`}
                    width={800}
                    height={400}
                    className={`w-full h-auto object-contain ${isImageLoading ? 'hidden' : 'block'}`}
                    unoptimized
                    onLoad={() => setIsImageLoading(false)}
                />
            )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-md mt-auto pt-4">
            {(['a', 'b', 'c', 'd'] as const).map(option => (
                <Button 
                    key={option}
                    variant={currentAnswer?.answer === option ? 'default' : 'outline'}
                    onClick={() => handleAnswerSelect(option)}
                    className="text-lg h-14"
                >
                    {option.toUpperCase()}
                </Button>
            ))}
        </div>
      </div>
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="p-4 border rounded-lg bg-card text-center">
            <Timer duration={2.5 * 60 * 60} onTimeUp={handleSubmit} />
        </div>
        <div className="p-4 border rounded-lg bg-card flex-1 min-h-0">
            <QuestionSidebar 
                questions={questions}
                answers={answers}
                currentQuestionIndex={currentQuestionIndex}
                onQuestionSelect={handleQuestionSelect}
            />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleQuestionSelect(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}>Previous</Button>
            <Button onClick={() => handleQuestionSelect(Math.min(questions.length - 1, currentQuestionIndex + 1))} disabled={currentQuestionIndex === questions.length - 1}>Next</Button>
        </div>
        <Button onClick={handleMarkForReview} variant={currentAnswer?.status === 'marked' ? 'secondary' : 'outline'}>
            {currentAnswer?.status === 'marked' ? 'Unmark Review' : 'Mark for Review'}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Test
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent container={elem.current ?? undefined}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end the test and calculate your score. You cannot undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
