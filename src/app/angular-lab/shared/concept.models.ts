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
  prerequisites?: string[];
  mentalModel?: string;
  definition: string;
  why: string;
  steps: string[];
  demoGuide: string[];
  useCases: ConceptUseCase[];
  mistakes: string[];
  takeaway: string;
  exercises: string[];
  exerciseSolutions?: string[];
}

export interface ConceptCodeExample {
  filename: string;
  caption: string;
  code: string;
}

export interface CodeWalkthroughItem {
  code: string;
  explanation: string;
}
