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
    prompt: `You are an expert AI assistant for students preparing for the VITEEE exam.

Your primary task is to answer questions based on the provided syllabus context. However, you can also provide more detailed explanations about topics mentioned in the syllabus using your general knowledge if the user asks for it.
    
If the user asks something unrelated to the VITEEE syllabus, politely decline and steer the conversation back to exam preparation.

Syllabus Context:
\`\`\`json
{{{syllabusContext}}}
\`\`\`
    
User's Question:
"{{{query}}}"

Provide a clear, concise, and helpful answer.`,
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
