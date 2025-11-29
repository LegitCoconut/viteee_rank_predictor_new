"use client";

import { useState, useEffect, useRef, FormEvent, Fragment } from 'react';
import { Bot, User, CornerDownLeft, Loader2, BookCopy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithSyllabus } from '@/ai/flows/syllabus-chat-flow';
import type { SyllabusChatInput } from '@/ai/schemas/syllabus-chat-schema';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const trackAIUsage = () => {
    const hasTracked = sessionStorage.getItem('aiUsageTracked');
    if (!hasTracked) {
        fetch('/api/analytics/ai-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'ai_usage_start' })
        }).then(() => {
            sessionStorage.setItem('aiUsageTracked', 'true');
        }).catch(console.error);
    }
};

const parseMessage = (content: string) => {
  return content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
};

export function AIChatAssistant({ syllabusContext }: { syllabusContext: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('chatHistory');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      localStorage.removeItem('chatHistory');
    }
    trackAIUsage();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await chatWithSyllabus({
        query: input,
        syllabusContext,
      } as SyllabusChatInput);
      const assistantMessage: Message = { role: 'assistant', content: aiResponse.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I ran into an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isDialog = (
    <DialogContent className="h-full max-h-full w-full max-w-full flex flex-col p-0 sm:rounded-none">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-6 w-6" />
              Syllabus AI Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
              <div className="space-y-4 pr-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <BookCopy className="h-10 w-10 mb-4" />
                    <p className="text-center">Ask me anything about the VITEEE syllabus!</p>
                    <p className="text-sm text-center">For example: "What are the topics in Physics?"</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] text-left ${
                          message.role === 'user'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-card text-card-foreground border'
                        }`}
                      >
                        <p className="text-sm">{parseMessage(message.content)}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="bg-muted rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex items-start gap-3">
                     <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="rounded-lg px-4 py-2 max-w-[80%] text-left bg-card text-card-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Ask about the syllabus..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <CornerDownLeft className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </DialogContent>
  );

  // This component can be used inside a Dialog or as a standalone button.
  // If used inside a Dialog, DialogTrigger should wrap the button that opens it.
  // This check is a bit of a hack to see if we're being rendered as a direct child of a Dialog.
  // A better approach would be to have two separate components.
  const isInsideDialog = syllabusContext === undefined;

  if (isInsideDialog) {
    return isDialog;
  }

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <Sparkles className="h-6 w-6" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
        </DialogTrigger>
        {isDialog}
    </Dialog>
  );
}
