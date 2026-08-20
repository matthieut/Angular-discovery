export interface ConceptUseCase {
  title: string;
  description: string;
}

export interface ConceptComparisonItem {
  badge: string;
  title: string;
  description: string;
  points: string[];
  recommended?: boolean;
}

export interface ConceptLearningContent {
  definition: string;
  why: string;
  steps: string[];
  demoGuide: string[];
  useCases: ConceptUseCase[];
  mistakes: string[];
  takeaway: string;
  exercises: string[];
}

export interface CodeWalkthroughItem {
  code: string;
  explanation: string;
}
