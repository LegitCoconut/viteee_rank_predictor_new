import { z } from 'genkit';

/**
 * @fileOverview Schemas for the syllabus chat flow.
 *
 * - SyllabusChatInputSchema - The Zod schema for the chat input.
 * - SyllabusChatInput - The TypeScript type for the chat input.
 * - SyllabusChatOutputSchema - The Zod schema for the chat output.
 * - SyllabusChatOutput - The TypeScript type for the chat output.
 */

export const SyllabusChatInputSchema = z.object({
  query: z.string().describe("The user's question about the syllabus."),
  syllabusContext: z.string().describe('The entire syllabus content in JSON format.'),
});
export type SyllabusChatInput = z.infer<typeof SyllabusChatInputSchema>;

export const SyllabusChatOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's query."),
});
export type SyllabusChatOutput = z.infer<typeof SyllabusChatOutputSchema>;
