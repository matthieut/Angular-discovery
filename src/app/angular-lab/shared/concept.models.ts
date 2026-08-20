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
