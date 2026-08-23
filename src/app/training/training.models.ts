export type TrainingStatus = 'mastered' | 'consolidate' | 'fragile' | 'unassessed';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type QuestionType = 'quiz' | 'code-diagnostic' | 'code-completion' | 'architecture';
export type MasteryDimension = 'Compréhension' | 'Lecture de code' | 'Mise en pratique' | 'Décision';

export interface TrainingOption { id: string; label: string; detail: string; }
export interface TrainingQuestion {
  id: string; type: QuestionType; dimension: MasteryDimension; prompt: string; code?: string;
  options: readonly TrainingOption[]; correctOptionId: string; hint: string; explanation: string;
  misconception: string; remediation: readonly string[];
}
export interface TrainingLesson {
  id: string; title: string; category: string; icon: string; description: string;
  labRoute: string; questions: readonly TrainingQuestion[];
}
export interface TrainingAnswer {
  conceptId: string; questionId: string; optionId: string; confidence: ConfidenceLevel;
  usedHint: boolean; correct: boolean; answeredAt: string;
}
export interface LessonStats {
  answered: number; correct: number; total: number; progress: number; mastery: number; status: TrainingStatus;
}
