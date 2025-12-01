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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Menu } from 'lucide-react';
import type { QuestionWithImage, Answer } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from './ui/skeleton';

interface MockTestUIProps {
  questions: QuestionWithImage[];
  setupData: { name: string; stream: string };
}

export function MockTestUI({ questions, setupData }: MockTestUIProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map(q => ({ questionId: q._id, answer: null, status: 'unanswered', visited: false }))
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
    // Mark first question as visited
    setAnswers(prev =>
      prev.map((ans, index) =>
        index === 0 ? { ...ans, visited: true } : ans
      )
    );
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
      setAnswers(prev =>
        prev.map((ans, idx) =>
          idx === index ? { ...ans, visited: true } : ans
        )
      );
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
      apt_eng: { score: 0, total: 0 },
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

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentQuestionIndex]);

  return (
    <div ref={elem} className="w-full h-[100dvh] bg-background flex flex-col overflow-hidden">

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-2 border-b bg-card shrink-0">
        <div className="text-sm font-bold">
          <Timer duration={2.5 * 60 * 60} onTimeUp={handleSubmit} />
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isSubmitting}>
                End Test
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[380px] p-0">
              <div className="h-full flex flex-col p-4">
                <h3 className="font-bold mb-4">Question Palette</h3>
                <div className="flex-1 min-h-0">
                  <QuestionSidebar
                    questions={questions}
                    answers={answers}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionSelect={(index) => {
                      handleQuestionSelect(index);
                      // Close sheet logic would go here if we had control, 
                      // but for now user closes it manually or we use a controlled Sheet.
                    }}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Area (Image) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start md:flex-row md:gap-4">

        {/* Desktop Sidebar (Left/Right depending on preference, currently Right in original) */}
        {/* We'll keep the original desktop layout structure but wrap it */}

        <div className="flex-1 flex flex-col items-center justify-start w-full h-full md:border md:rounded-lg md:bg-card md:p-4 gap-4">
          <div className="w-full flex-1 flex items-center justify-center min-h-0 relative">
            {isImageLoading && <Skeleton className="w-full h-full absolute inset-0" />}
            {currentQuestion && currentQuestion.imageUrl && (
              <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={currentQuestion._id}
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentQuestionIndex + 1}`}
                  className={`max-w-full max-h-full object-contain ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
            )}
          </div>

          {/* Desktop Options (Hidden on Mobile, shown in bottom bar instead) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl mt-auto pt-4">
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

        {/* Desktop Right Sidebar */}
        <div className="hidden md:flex w-80 flex-col gap-4 h-full">
          <div className="p-4 border rounded-lg bg-card text-center shrink-0">
            <Timer duration={2.5 * 60 * 60} onTimeUp={handleSubmit} />
          </div>
          <div className="p-4 border rounded-lg bg-card flex-1 min-h-0 overflow-hidden">
            <QuestionSidebar
              questions={questions}
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <Button onClick={() => {
              if (currentQuestionIndex > 0) {
                handleQuestionSelect(currentQuestionIndex - 1);
              }
            }} disabled={currentQuestionIndex === 0}>Previous</Button>
            <Button onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                handleQuestionSelect(currentQuestionIndex + 1);
              }
            }} disabled={currentQuestionIndex === questions.length - 1}>Next</Button>
          </div>
          <Button onClick={handleMarkForReview} variant={currentAnswer?.status === 'marked' ? 'secondary' : 'outline'} className="shrink-0">
            {currentAnswer?.status === 'marked' ? 'Unmark Review' : 'Mark for Review'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isSubmitting} className="shrink-0">
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

      {/* Mobile Bottom Bar */}
      <div className="md:hidden flex flex-col gap-2 p-2 border-t bg-card shrink-0">
        {/* Options Row */}
        <div className="grid grid-cols-4 gap-2">
          {(['a', 'b', 'c', 'd'] as const).map(option => (
            <Button
              key={option}
              variant={currentAnswer?.answer === option ? 'default' : 'outline'}
              onClick={() => handleAnswerSelect(option)}
              className="h-12 text-lg"
            >
              {option.toUpperCase()}
            </Button>
          ))}
        </div>
        {/* Navigation Row */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                handleQuestionSelect(currentQuestionIndex - 1);
              }
            }}
            disabled={currentQuestionIndex === 0}
          >
            Prev
          </Button>

          <Button
            onClick={handleMarkForReview}
            variant={currentAnswer?.status === 'marked' ? 'secondary' : 'outline'}
            className={currentAnswer?.status === 'marked' ? 'bg-yellow-100 text-yellow-800 border-yellow-500' : ''}
          >
            {currentAnswer?.status === 'marked' ? 'Unmark' : 'Mark'}
          </Button>

          <Button
            variant="default"
            onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                handleQuestionSelect(currentQuestionIndex + 1);
              }
            }}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}
