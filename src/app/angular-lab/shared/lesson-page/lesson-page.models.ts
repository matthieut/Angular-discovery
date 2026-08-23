import {
  CodeWalkthroughItem,
  ConceptCodeExample,
  ConceptComparisonItem,
  ConceptLearningContent,
} from '../concept.models';
import { ConceptLevel } from '../concept-header/concept-header';

export type LessonDemoKind =
  | 'lifecycle'
  | 'http'
  | 'responsibility'
  | 'communication'
  | 'projection'
  | 'queries'
  | 'host'
  | 'composition'
  | 'dynamic'
  | 'concept';

export interface LessonPageDefinition {
  id: string;
  category: string;
  sheetNumber: number;
  title: string;
  description: string;
  level: ConceptLevel;
  demoKind: LessonDemoKind;
  demoTitle: string;
  demoDescription: string;
  demoActions: string[];
  demoResults: string[];
  demoCode?: string[];
  codeExamples: ConceptCodeExample[];
  walkthrough: CodeWalkthroughItem[];
  comparisons: ConceptComparisonItem[];
  learning: ConceptLearningContent;
  current: number;
  previousRoute: string;
  nextRoute: string;
}
