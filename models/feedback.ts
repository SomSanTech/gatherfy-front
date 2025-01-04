export interface ExistingQuestion {
  questionId: number;
  eventId: number;
  questionText: string;
  questionType: string;
}
export interface DefaultQuestion {
  questionText: string;
  questionType: string;
  questionTypeName: string;
}
export interface AnswerBody {
  feedbackId: number;
  questionId: number;
  eventId: number;
  answerText: string | number;
}
export interface FeedbackBody {
  eventId: number;
  userId: number | undefined;
  feedbackRating: number;
  feedbackComment: string;
}
export interface AddQuestion {
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}
export interface EditQuestion {
  questionId: string;
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}
export interface Answer {
  answerId: number;
  feedbackId: number;
  questionId: number;
  eventId: number;
  questionText: string;
  answerText: string;
}
export interface Feedback {
  feedbackId: number;
  eventId: number;
  userId: number;
  username: string;
  feedbackRating: number;
  feedbackComment: string;
  createdAt: Date;
}
