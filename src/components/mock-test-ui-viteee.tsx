"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/lib/exam-pattern";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer } from "@/components/timer";
import { Loader2, Calculator as CalcIcon, ChevronLeft, ChevronRight, X, Info, FileText } from "lucide-react";
import type { QuestionWithImage, Answer } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface MockTestUIViteeeProps {
  questions: QuestionWithImage[];
  setupData: { name: string; stream: string; predefinedName?: string };
}

type VisualState =
  | "notVisited"
  | "notAnswered"
  | "answered"
  | "marked"
  | "answeredMarked";

const SUBJECT_ORDER = ["maths", "physics", "chemistry", "apt_eng"] as const;
const SUBJECT_DISPLAY: Record<string, string> = {
  maths: "Maths",
  physics: "Physics",
  chemistry: "Chemistry",
  apt_eng: "Apt & Eng",
};

function visualStateFor(ans: Answer | undefined): VisualState {
  if (!ans) return "notVisited";
  if (!ans.visited) return "notVisited";
  if (ans.status === "marked") {
    return ans.answer ? "answeredMarked" : "marked";
  }
  if (ans.status === "answered" && ans.answer) return "answered";
  return "notAnswered";
}

export function MockTestUIViteee({ questions, setupData }: MockTestUIViteeeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => ({
      questionId: q._id,
      answer: null,
      status: "unanswered",
      visited: false,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    setIsFullscreen(!!document.fullscreenElement);
    openFullscreen();
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    setAnswers((prev) =>
      prev.map((ans, index) => (index === 0 ? { ...ans, visited: true } : ans))
    );
  }, []);

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const currentSubject = currentQuestion?.subject ?? "maths";

  const subjectToFirstIndex = useMemo(() => {
    const map: Record<string, number> = {};
    questions.forEach((q, i) => {
      if (!(q.subject in map)) map[q.subject] = i;
    });
    return map;
  }, [questions]);

  const subjectCounts = useMemo(() => {
    const map: Record<string, number> = { maths: 0, physics: 0, chemistry: 0, apt_eng: 0 };
    questions.forEach((q) => {
      if (q.subject in map) map[q.subject]++;
    });
    return map;
  }, [questions]);

  const stats = useMemo(() => {
    let notVisited = 0, notAnswered = 0, answered = 0, marked = 0, answeredMarked = 0;
    for (const a of answers) {
      const v = visualStateFor(a);
      if (v === "notVisited") notVisited++;
      else if (v === "notAnswered") notAnswered++;
      else if (v === "answered") answered++;
      else if (v === "marked") marked++;
      else if (v === "answeredMarked") answeredMarked++;
    }
    return { notVisited, notAnswered, answered, marked, answeredMarked };
  }, [answers]);

  const handleAnswerSelect = (option: "a" | "b" | "c" | "d") => {
    setAnswers((prev) =>
      prev.map((ans, index) =>
        index === currentQuestionIndex
          ? {
            ...ans,
            answer: option,
            status: ans.status === "marked" ? "marked" : "answered",
          }
          : ans
      )
    );
  };

  const goToIndex = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questions.length) return;
      if (questions[idx].subject !== currentSubject) return; // sections are locked
      setCurrentQuestionIndex(idx);
      setAnswers((prev) =>
        prev.map((ans, i) => (i === idx ? { ...ans, visited: true } : ans))
      );
    },
    [questions, currentSubject]
  );

  const handleSaveAndNext = () => {
    setAnswers((prev) =>
      prev.map((ans, index) =>
        index === currentQuestionIndex && ans.status === "marked"
          ? { ...ans, status: ans.answer ? "answered" : "unanswered" }
          : ans
      )
    );
    if (currentQuestionIndex < questions.length - 1) {
      goToIndex(currentQuestionIndex + 1);
    }
  };

  const handleMarkAndNext = () => {
    setAnswers((prev) =>
      prev.map((ans, index) =>
        index === currentQuestionIndex
          ? {
              ...ans,
              status:
                ans.status === "marked"
                  ? ans.answer
                    ? "answered"
                    : "unanswered"
                  : "marked",
            }
          : ans
      )
    );
    if (currentQuestionIndex < questions.length - 1) {
      goToIndex(currentQuestionIndex + 1);
    }
  };

  const handleClearResponse = () => {
    setAnswers((prev) =>
      prev.map((ans, index) =>
        index === currentQuestionIndex
          ? {
            ...ans,
            answer: null,
            status: ans.status === "marked" ? "marked" : "unanswered",
          }
          : ans
      )
    );
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const MARK_CORRECT = 4;
    const MARK_WRONG = -1;
    let score = 0;
    let wrong = 0;
    const sectionScores: Record<string, { score: number; wrong: number; total: number }> = {
      maths: { score: 0, wrong: 0, total: 0 },
      physics: { score: 0, wrong: 0, total: 0 },
      chemistry: { score: 0, wrong: 0, total: 0 },
      apt_eng: { score: 0, wrong: 0, total: 0 },
    };
    questions.forEach((q, index) => {
      const subj = q.subject;
      if (!sectionScores[subj]) return;
      sectionScores[subj].total++;
      const chosen = answers[index]?.answer;
      if (chosen == null) return;
      if (chosen === q.correct_option) {
        sectionScores[subj].score++;
        score++;
      } else {
        sectionScores[subj].wrong++;
        wrong++;
      }
    });
    const totalQuestions = questions.length;
    const marks = score * MARK_CORRECT + wrong * MARK_WRONG;
    const maxMarks = totalQuestions * MARK_CORRECT;
    const anySetup = setupData as any;
    const examResult = {
      examId: uuidv4(),
      userId: setupData.name,
      stream: setupData.stream,
      answers,
      score,
      wrong,
      marks,
      maxMarks,
      totalQuestions,
      sectionScores,
      timestamp: new Date().toISOString(),
      mode: anySetup.mode ?? "random",
      predefinedId: anySetup.predefinedId,
      predefinedName: setupData.predefinedName,
    };
    try {
      const pastResults = JSON.parse(localStorage.getItem("mockTestResults") || "[]");
      pastResults.push(examResult);
      localStorage.setItem("mockTestResults", JSON.stringify(pastResults));
      try {
        const snapshot = questions.map((q) => ({
          _id: q._id,
          imageUrl: q.imageUrl,
          correct_option: q.correct_option,
          subject: q.subject,
        }));
        const currentMap: Record<string, unknown> = JSON.parse(
          localStorage.getItem("mockTestQuestions") || "{}"
        );
        currentMap[examResult.examId] = snapshot;
        try {
          localStorage.setItem("mockTestQuestions", JSON.stringify(currentMap));
        } catch {
          const liveIds = new Set<string>(
            (pastResults as Array<{ examId?: string }>)
              .map((r) => r?.examId)
              .filter((id): id is string => typeof id === "string")
          );
          const pruned: Record<string, unknown> = {};
          for (const [id, v] of Object.entries(currentMap)) {
            if (liveIds.has(id)) pruned[id] = v;
          }
          try {
            localStorage.setItem("mockTestQuestions", JSON.stringify(pruned));
          } catch {
            /* drop */
          }
        }
      } catch {
        /* drop snapshot */
      }
      await fetch("/api/mocktest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examResult),
      });
    } catch (err) {
      console.error("Failed to save results:", err);
    } finally {
      sessionStorage.setItem("latestResult", JSON.stringify(examResult));
      try {
        sessionStorage.setItem("latestQuestions", JSON.stringify(questions));
      } catch {
        /* drop */
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      router.push("/mocktest/results");
    }
  }, [answers, questions, setupData, router, isSubmitting]);

  // Move to the next section present in the paper, or submit after the last one.
  const advanceSection = useCallback(() => {
    const next = SUBJECT_ORDER.slice(SUBJECT_ORDER.indexOf(currentSubject as typeof SUBJECT_ORDER[number]) + 1)
      .map((s) => subjectToFirstIndex[s])
      .find((i) => i !== undefined);
    if (next === undefined) return void handleSubmit();
    setCurrentQuestionIndex(next);
    setAnswers((prev) => prev.map((a, i) => (i === next ? { ...a, visited: true } : a)));
  }, [currentSubject, subjectToFirstIndex, handleSubmit]);

  const [sectionConfirmOpen, setSectionConfirmOpen] = useState(false);

  return (
    <div
      ref={elem}
      className="viteee-ui relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-[#222]"
      style={{ fontFamily: 'Verdana, "DejaVu Sans", Tahoma, Geneva, sans-serif' }}
    >
      {!isFullscreen && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 p-4 text-center backdrop-blur-sm">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Test Paused</h2>
            <p className="text-gray-600">
              Please enable fullscreen mode to continue the test. This is required to ensure a fair testing environment.
            </p>
            <button
              onClick={openFullscreen}
              className="rounded-md bg-[#2d89ef] px-6 py-2 text-white hover:bg-[#1d6cc0]"
            >
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top black bar */}
      <div className="flex shrink-0 items-center justify-between bg-[#1a1a1a] px-3 py-2 text-[13px]">
        <div className="truncate font-semibold text-[#f2d94e]">
          {setupData.predefinedName
            ? setupData.predefinedName
            : "MPCEA - VITEEE MOCK TEST"}
        </div>
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2d89ef]">
              <Info className="h-2.5 w-2.5" />
            </span>
            Instructions
          </button>
          <button
            onClick={() => setShowQuestionPaper(true)}
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#4caf50]">
              <FileText className="h-2.5 w-2.5" />
            </span>
            Question Paper
          </button>
        </div>
      </div>

      {/* Section bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-300 bg-white px-3 py-1.5">
        <button className="text-gray-400 hover:text-gray-600" aria-label="scroll sections left">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center">
          <span className="relative flex items-center gap-1.5 rounded-t-md border border-b-0 border-[#2d89ef] bg-[#e6f1fc] px-3 py-1.5 text-xs font-semibold text-[#2d89ef]">
            MPCEA
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2d89ef] text-[9px] text-white">
              i
            </span>
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600" aria-label="scroll sections right">
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Sections
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setShowCalculator(true)}
            className="flex h-7 w-7 items-center justify-center rounded bg-[#d84d1a] text-white hover:bg-[#b63d11]"
            title="Scientific Calculator"
          >
            <CalcIcon className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <span className="text-gray-700">Time Left :</span>
            <span className="font-mono text-gray-900">
              <Timer
                key={currentSubject}
                duration={(SECTIONS.find((s) => s.key === currentSubject)?.minutes ?? 10) * 60}
                onTimeUp={advanceSection}
                isPaused={!isFullscreen}
              />
            </span>
          </div>
          <div className="ml-2 flex h-8 w-12 items-center justify-center border border-gray-300 bg-white text-[10px] font-bold tracking-wider text-[#1a1a1a]">
            CBT
          </div>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="flex shrink-0 items-center border-b border-gray-300 bg-white px-3 py-1">
        <button className="mr-1 text-gray-400 hover:text-gray-600">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-0.5 overflow-x-auto">
          {SUBJECT_ORDER.filter((s) => subjectCounts[s] > 0).map((subj) => {
            const active = currentSubject === subj;
            return (
              <button
                key={subj}
                disabled={!active}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide ${active
                  ? "border border-b-0 border-[#2d89ef] bg-white text-[#2d89ef]"
                  : "border border-transparent bg-[#eef4fb] text-[#2d89ef] hover:bg-[#e2ecf6]"
                  }`}
              >
                {SUBJECT_DISPLAY[subj]}
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-white ${active ? "bg-[#2d89ef]" : "bg-[#2d89ef]/70"
                    }`}
                >
                  i
                </span>
              </button>
            );
          })}
        </div>
        <button className="ml-1 text-gray-400 hover:text-gray-600">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => setSectionConfirmOpen(true)}
          className="ml-2 whitespace-nowrap rounded-sm bg-[#2d89ef] px-3 py-1 text-[11px] font-bold uppercase text-white hover:bg-[#1f6fc9]"
        >
          Submit Section
        </button>
      </div>

      {/* Rendered inside the fullscreen element; window.confirm would exit fullscreen. */}
      <AlertDialog open={sectionConfirmOpen} onOpenChange={setSectionConfirmOpen}>
        <AlertDialogContent
          container={elem.current ?? undefined}
          className="border-gray-300 bg-white text-gray-900"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Submit this section?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              You cannot return to this section once submitted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={advanceSection} className="bg-[#2d89ef] text-white hover:bg-[#1f6fc9]">
              Submit Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main layout: question area + right sidebar */}
      <div className="flex min-h-0 flex-1">
        {/* Left: Question panel */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="border-b border-gray-200 px-5 py-2 text-[13px] font-bold text-gray-900">
            Question No. {currentQuestionIndex + 1}
          </div>

          <div className="flex-1 overflow-auto px-5 py-4">
            <div className="relative mx-auto max-w-3xl">
              {isImageLoading && (
                <Skeleton className="h-64 w-full" />
              )}
              {currentQuestion?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={currentQuestion._id}
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentQuestionIndex + 1}`}
                  className={`mx-auto max-h-[50vh] w-auto object-contain ${isImageLoading ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-200`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              )}

              {/* Four A/B/C/D radio options */}
              <div className="mt-6 space-y-2.5">
                {(["a", "b", "c", "d"] as const).map((opt) => {
                  const selected = currentAnswer?.answer === opt;
                  return (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-sm border border-transparent px-2 py-1.5 text-[13px] hover:bg-gray-50 ${selected ? "bg-[#e6f1fc]" : ""
                        }`}
                    >
                      <span className="relative flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 bg-white">
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-[#2d89ef]" />
                        )}
                      </span>
                      <input
                        type="radio"
                        name={`opt-${currentQuestion?._id}`}
                        value={opt}
                        checked={selected}
                        onChange={() => handleAnswerSelect(opt)}
                        className="sr-only"
                      />
                      <span className="font-semibold uppercase text-gray-700">
                        ({opt})
                      </span>
                      <span className="text-gray-600">Option {opt.toUpperCase()}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex shrink-0 items-center gap-2 border-t border-gray-300 bg-[#f5f5f5] px-3 py-2">
            <button
              onClick={handleMarkAndNext}
              className="rounded-sm border border-gray-400 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
              {currentAnswer?.status === "marked" ? "Unmark & Next" : "Mark for Review & Next"}
            </button>
            <button
              onClick={handleClearResponse}
              className="rounded-sm border border-gray-400 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Clear Response
            </button>
            <div className="ml-auto flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isSubmitting}
                    className="rounded-sm border border-red-700 bg-red-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Submitting
                      </span>
                    ) : (
                      "Submit Test"
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  container={elem.current ?? undefined}
                  className="border-gray-300 bg-white text-gray-900"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Submit this test?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This will end the test and calculate your score. You cannot undo this action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSubmit}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                onClick={handleSaveAndNext}
                className="rounded-sm border border-[#2d89ef] bg-[#2d89ef] px-5 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#1d6cc0]"
              >
                Save &amp; Next
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-l border-gray-300 bg-[#e9f2fb] lg:flex">
          <LegendGrid stats={stats} />
          <div className="bg-[#2d89ef] px-3 py-1.5 text-[12px] font-bold text-white">
            {SUBJECT_DISPLAY[currentSubject] ?? currentSubject}
          </div>
          <div className="px-3 pb-2 pt-3 text-[12px] font-semibold text-gray-700">
            Choose a Question
          </div>
          <div className="flex-1 overflow-auto px-3 pb-3">
            <QuestionPalette
              questions={questions}
              answers={answers}
              currentIndex={currentQuestionIndex}
              onSelect={(i) => goToIndex(i)}
              currentSubject={currentSubject}
            />
          </div>
        </aside>
      </div>

      {/* Version footer */}
      <div className="shrink-0 border-t border-gray-300 bg-[#f5f5f5] px-3 py-1 text-center text-[10px] text-gray-500">
        Latest Deployment: 22/04/2026 11:35PM
      </div>

      {/* Dialogs */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent
          className="max-w-3xl border-gray-300 bg-white text-gray-900"
          container={elem.current ?? undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900">Instructions</DialogTitle>
          </DialogHeader>
          <InstructionsContent />
        </DialogContent>
      </Dialog>

      <Dialog open={showQuestionPaper} onOpenChange={setShowQuestionPaper}>
        <DialogContent
          className="max-w-4xl border-gray-300 bg-white text-gray-900"
          container={elem.current ?? undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900">Question Paper</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto p-2">
            <QuestionPaperList questions={questions} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent
          className="max-w-sm border-gray-300 bg-white text-gray-900"
          container={elem.current ?? undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900">Scientific Calculator</DialogTitle>
          </DialogHeader>
          <ViteeeCalculator />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Sub-components ----------

function LegendGrid({
  stats,
}: {
  stats: { notVisited: number; notAnswered: number; answered: number; marked: number; answeredMarked: number };
}) {
  const items: Array<{ chip: JSX.Element; label: string; count: number }> = [
    {
      chip: (
        <span className="flex h-6 w-6 items-center justify-center bg-[#ccc] text-[11px] font-bold text-gray-800">
          {stats.notVisited}
        </span>
      ),
      label: "Not Visited",
      count: stats.notVisited,
    },
    {
      chip: <PlateChip color="#e74c3c" num={stats.notAnswered} />,
      label: "Not Answered",
      count: stats.notAnswered,
    },
    {
      chip: <PlateChip color="#2ecc71" num={stats.answered} />,
      label: "Answered",
      count: stats.answered,
    },
    {
      chip: <CircleChip color="#8e44ad" num={stats.marked} />,
      label: "Marked for Review",
      count: stats.marked,
    },
    {
      chip: <CircleChip color="#8e44ad" num={stats.answeredMarked} withCheck />,
      label: "Answered & Marked for Review (will not be considered for evaluation)",
      count: stats.answeredMarked,
    },
  ];
  return (
    <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-x-2 gap-y-2 border-b border-gray-300 bg-white px-3 py-3 text-[11px]">
      {items.map((it, i) => (
        <div key={i} className="contents">
          {it.chip}
          <div className="leading-tight text-gray-700">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function PlateChip({ color, num }: { color: string; num: number }) {
  // "Home plate" pentagon for Answered / Not-Answered states.
  return (
    <div className="relative">
      <svg width="26" height="26" viewBox="0 0 26 26">
        <path
          d="M2 2 H24 V18 L13 24 L2 18 Z"
          fill={color}
          stroke={color}
          strokeWidth="0"
        />
      </svg>
      <div className="absolute inset-0 flex items-start justify-center pt-0.5 text-[10px] font-bold text-white">
        {num}
      </div>
    </div>
  );
}

function CircleChip({
  color,
  num,
  withCheck = false,
}: {
  color: string;
  num: number;
  withCheck?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {num}
      </div>
      {withCheck && (
        <div className="absolute -right-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#2ecc71] text-[8px] font-bold text-white">
          ✓
        </div>
      )}
    </div>
  );
}

function QuestionPalette({
  questions,
  answers,
  currentIndex,
  currentSubject,
  onSelect,
}: {
  questions: QuestionWithImage[];
  answers: Answer[];
  currentIndex: number;
  currentSubject: string;
  onSelect: (idx: number) => void;
}) {
  // Show numbers for the current subject's block only - matches VITEEE UX
  // where each section has its own palette.
  const items = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => q.subject === currentSubject);

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(({ idx }, displayIndex) => {
        const state = visualStateFor(answers[idx]);
        const isCurrent = idx === currentIndex;
        const localNumber = displayIndex + 1;
        return (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`relative ${isCurrent ? "ring-2 ring-offset-1 ring-[#2d89ef]" : ""}`}
            title={`Question ${localNumber}`}
          >
            <PaletteCell state={state} num={localNumber} />
          </button>
        );
      })}
    </div>
  );
}

function PaletteCell({ state, num }: { state: VisualState; num: number }) {
  if (state === "notVisited") {
    return (
      <div className="flex h-9 w-full items-center justify-center border border-gray-400 bg-white text-[12px] font-semibold text-gray-800">
        {num}
      </div>
    );
  }
  if (state === "notAnswered") {
    return (
      <div className="relative h-9 w-full">
        <svg viewBox="0 0 40 36" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M1 1 H39 V25 L20 35 L1 25 Z" fill="#e74c3c" />
        </svg>
        <div className="relative flex h-full w-full items-start justify-center pt-0.5 text-[12px] font-bold text-white">
          {num}
        </div>
      </div>
    );
  }
  if (state === "answered") {
    return (
      <div className="relative h-9 w-full">
        <svg viewBox="0 0 40 36" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M1 1 H39 V25 L20 35 L1 25 Z" fill="#2ecc71" />
        </svg>
        <div className="relative flex h-full w-full items-start justify-center pt-0.5 text-[12px] font-bold text-white">
          {num}
        </div>
      </div>
    );
  }
  if (state === "marked") {
    return (
      <div className="flex h-9 w-full items-center justify-center rounded-full bg-[#8e44ad] text-[12px] font-bold text-white">
        {num}
      </div>
    );
  }
  // answeredMarked
  return (
    <div className="relative flex h-9 w-full items-center justify-center rounded-full bg-[#8e44ad] text-[12px] font-bold text-white">
      {num}
      <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2ecc71] text-[9px]">
        ✓
      </span>
    </div>
  );
}

function InstructionsContent() {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <div className="font-semibold text-gray-900">General Instructions:</div>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Total duration of examination is 120 minutes. Each section has a fixed time limit (Mathematics 50, Physics 30, Chemistry 30, Aptitude &amp; English 10 minutes); when a section's time ends you move to the next section and cannot return.</li>
        <li>
          The clock will be set at the server. The countdown timer in the top
          right corner of the screen will display the remaining time available
          for you to complete the examination. When the timer reaches zero, the
          examination will end by itself.
        </li>
        <li>This is a implementation of the actual VITEEE CBT UI to give you a feel of the actual test.</li>
        <li>For any kind of issues with the platform, contact us thorugh the feedback form or via our email vitranks@malabarmatrix.in</li>
        <li>The Question Palette on the right shows the status of each question:</li>
      </ol>
      <ul className="space-y-2 pl-2 text-xs">
        <li className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center border border-gray-400 bg-white text-[11px] font-bold">
            1
          </div>
          You have not visited the question yet.
        </li>
        <li className="flex items-center gap-2">
          <PlateChip color="#e74c3c" num={2} />
          You have not answered the question.
        </li>
        <li className="flex items-center gap-2">
          <PlateChip color="#2ecc71" num={3} />
          You have answered the question.
        </li>
        <li className="flex items-center gap-2">
          <CircleChip color="#8e44ad" num={4} />
          You have NOT answered but marked for review.
        </li>
        <li className="flex items-center gap-2">
          <CircleChip color="#8e44ad" num={5} withCheck />
          Answered and marked for review (will be considered for evaluation).
        </li>
      </ul>
    </div>
  );
}

function QuestionPaperList({ questions }: { questions: QuestionWithImage[] }) {
  const bySubject = useMemo(() => {
    const map: Record<string, QuestionWithImage[]> = {};
    questions.forEach((q) => {
      if (!map[q.subject]) map[q.subject] = [];
      map[q.subject].push(q);
    });
    return map;
  }, [questions]);
  return (
    <div className="space-y-6">
      {SUBJECT_ORDER.filter((s) => bySubject[s]?.length).map((subj) => (
        <div key={subj}>
          <div className="mb-2 border-b border-gray-300 pb-1 text-[15px] font-semibold text-[#2d89ef]">
            {SUBJECT_DISPLAY[subj]}
          </div>
          <div className="space-y-3">
            {bySubject[subj].map((q, i) => (
              <div key={q._id} className="flex gap-3">
                <div className="shrink-0 pt-1 text-[11px] font-semibold text-gray-500">
                  Q.{i + 1})
                </div>
                {q.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={q.imageUrl}
                    alt={`Q${i + 1}`}
                    className="max-h-48 w-auto border border-gray-200 object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ViteeeCalculator() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<{ op: string; prev: number } | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const apply = (op: string, a: number, b: number): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const pressDigit = (d: string) => {
    if (justEvaluated) {
      setDisplay(d);
      setJustEvaluated(false);
      return;
    }
    if (display === "0" && d !== ".") setDisplay(d);
    else if (d === "." && display.includes(".")) return;
    else setDisplay(display + d);
  };

  const pressOp = (op: string) => {
    const value = parseFloat(display);
    if (pending && !justEvaluated) {
      const result = apply(pending.op, pending.prev, value);
      setDisplay(String(result));
      setPending({ op, prev: result });
    } else {
      setPending({ op, prev: value });
    }
    setJustEvaluated(true);
  };

  const pressEquals = () => {
    if (!pending) return;
    const value = parseFloat(display);
    const result = apply(pending.op, pending.prev, value);
    setDisplay(String(result));
    setPending(null);
    setJustEvaluated(true);
  };

  const pressClear = () => {
    setDisplay("0");
    setPending(null);
    setJustEvaluated(false);
  };

  const pressUnary = (fn: (n: number) => number) => {
    const value = parseFloat(display);
    setDisplay(String(fn(value)));
    setJustEvaluated(true);
  };

  const Btn = ({ children, onClick, variant = "default" }: { children: React.ReactNode; onClick: () => void; variant?: "default" | "op" | "eq" | "clear" }) => {
    const base = "h-10 rounded-sm text-sm font-semibold border";
    const styles = {
      default: "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
      op: "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
      eq: "bg-[#2ecc71] text-white border-[#26ae5f] hover:bg-[#26ae5f]",
      clear: "bg-red-500 text-white border-red-600 hover:bg-red-600",
    };
    return (
      <button onClick={onClick} className={`${base} ${styles[variant]}`}>
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-2">
      <div className="rounded border border-gray-300 bg-white px-3 py-3 text-right font-mono text-lg text-gray-900">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <Btn variant="clear" onClick={pressClear}>C</Btn>
        <Btn variant="op" onClick={() => pressUnary(Math.sqrt)}>√</Btn>
        <Btn variant="op" onClick={() => pressUnary((n) => n * n)}>x²</Btn>
        <Btn variant="op" onClick={() => pressOp("/")}>÷</Btn>

        <Btn onClick={() => pressDigit("7")}>7</Btn>
        <Btn onClick={() => pressDigit("8")}>8</Btn>
        <Btn onClick={() => pressDigit("9")}>9</Btn>
        <Btn variant="op" onClick={() => pressOp("*")}>×</Btn>

        <Btn onClick={() => pressDigit("4")}>4</Btn>
        <Btn onClick={() => pressDigit("5")}>5</Btn>
        <Btn onClick={() => pressDigit("6")}>6</Btn>
        <Btn variant="op" onClick={() => pressOp("-")}>−</Btn>

        <Btn onClick={() => pressDigit("1")}>1</Btn>
        <Btn onClick={() => pressDigit("2")}>2</Btn>
        <Btn onClick={() => pressDigit("3")}>3</Btn>
        <Btn variant="op" onClick={() => pressOp("+")}>+</Btn>

        <Btn onClick={() => pressDigit("0")}>0</Btn>
        <Btn onClick={() => pressDigit(".")}>.</Btn>
        <Btn variant="op" onClick={() => pressUnary((n) => -n)}>±</Btn>
        <Btn variant="eq" onClick={pressEquals}>=</Btn>
      </div>
      <p className="text-[10px] text-gray-500">
        Basic 4-function + √ / x² / negate. For full trig/log, use your OS calculator. A virtual calculator with more functions will be available on the actual VITEEE CBT test.
      </p>
    </div>
  );
}
