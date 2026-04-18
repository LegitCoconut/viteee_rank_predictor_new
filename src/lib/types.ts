export interface Question {
    _id: string;
    image_id: string;
    correct_option: 'a' | 'b' | 'c' | 'd';
    subject: string;
}

export interface QuestionWithImage extends Question {
    imageUrl: string;
}

export interface Answer {
    questionId: string;
    answer: 'a' | 'b' | 'c' | 'd' | null;
    status: 'answered' | 'unanswered' | 'marked';
    visited: boolean;
}

// Minimal subset of QuestionWithImage persisted per attempt so past tests can
// be re-opened in the detailed-review UI without refetching from the server.
export interface QuestionSnapshot {
    _id: string;
    imageUrl: string;
    correct_option: 'a' | 'b' | 'c' | 'd';
    subject: string;
}

export type MockTestMode = 'random' | 'predefined';

export interface MockTestSetup {
    name: string;
    stream: string;
    agree: boolean;
    token: string;
    mode: MockTestMode;
    predefinedId?: number;
    predefinedName?: string;
}

export interface PredefinedMockTestSummary {
    id: number;
    name: string;
    active: boolean;
}
