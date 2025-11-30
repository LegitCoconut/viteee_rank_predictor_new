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
}
