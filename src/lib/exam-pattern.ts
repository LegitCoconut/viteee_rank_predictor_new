// Single source of truth for the VITEEE paper: 100 Qs, 2 hours, fixed time per section.
export const SECTIONS = [
  { key: 'maths', label: 'Mathematics', questions: 40, minutes: 50 },
  { key: 'physics', label: 'Physics', questions: 25, minutes: 30 },
  { key: 'chemistry', label: 'Chemistry', questions: 25, minutes: 30 },
  { key: 'apt_eng', label: 'Aptitude & English', questions: 10, minutes: 10 },
] as const;

export const TOTAL_QUESTIONS = SECTIONS.reduce((n, s) => n + s.questions, 0);
export const TOTAL_MINUTES = SECTIONS.reduce((n, s) => n + s.minutes, 0);
