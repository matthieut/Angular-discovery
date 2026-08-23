export type TrainingStatus = 'mastered' | 'consolidate' | 'fragile' | 'unassessed';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface TrainingPath {
  id: string;
  title: string;
  icon: string;
  progress: number;
  completed: number;
  total: number;
}

export interface TrainingPriority {
  title: string;
  status: TrainingStatus;
  route: string;
}

export interface TrainingAnswer {
  conceptId: string;
  optionId: string;
  confidence: ConfidenceLevel;
  correct: boolean;
  answeredAt: string;
}
