'use server';

/**
 * @fileOverview A Genkit flow for chatting about the VITEEE syllabus.
 *
 * - chatWithSyllabus - A function that takes a user query and syllabus context to generate a response.
 */

import { ai } from '@/ai/genkit';
import { SyllabusChatInputSchema, SyllabusChatOutputSchema, type SyllabusChatInput, type SyllabusChatOutput } from '@/ai/schemas/syllabus-chat-schema';


export async function chatWithSyllabus(input: SyllabusChatInput): Promise<SyllabusChatOutput> {
  return syllabusChatFlow(input);
}

const syllabusChatPrompt = ai.definePrompt({
    name: 'syllabusChatPrompt',
    input: { schema: SyllabusChatInputSchema },
    output: { schema: SyllabusChatOutputSchema },
    prompt: `You are an expert AI assistant for students preparing for the VITEEE exam. Your task is to answer questions based *only* on the provided syllabus context.

    Do not answer any questions that are not related to the syllabus. If the user asks something off-topic, politely decline and steer the conversation back to the syllabus.
    
    If the information is not in the syllabus, state that clearly.
    
    Syllabus Context:
    \`\`\`json
    {{{syllabusContext}}}
    \`\`\`
    
    User's Question:
    "{{{query}}}"

    Provide a clear and concise answer based on the syllabus.`,
});

const syllabusChatFlow = ai.defineFlow(
  {
    name: 'syllabusChatFlow',
    inputSchema: SyllabusChatInputSchema,
    outputSchema: SyllabusChatOutputSchema,
  },
  async (input) => {
    const { output } = await syllabusChatPrompt(input);
    if (!output) {
      return { answer: "I'm sorry, I couldn't generate a response. Please try again." };
    }
    return output;
  }
);
