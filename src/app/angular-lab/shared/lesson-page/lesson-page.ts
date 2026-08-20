import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodePreview } from '../code-preview/code-preview';
import { CodeWalkthrough } from '../code-walkthrough/code-walkthrough';
import { ConceptComparison } from '../concept-comparison/concept-comparison';
import { ConceptHeader } from '../concept-header/concept-header';
import { ConceptLearning } from '../concept-learning/concept-learning';
import { ConceptPagination } from '../concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../concept-tabs/concept-tabs';
import { DemoHeader } from '../demo-header/demo-header';
import { LAB_LESSONS } from './lessons.data';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPage {
  private readonly route = inject(ActivatedRoute);
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly selectedStep = signal(0);
  readonly lesson = computed(() => {
    const id = this.route.snapshot.data['lessonId'] as string;
    const lesson = LAB_LESSONS[id];
    if (!lesson) throw new Error(`Fiche Angular Lab inconnue : ${id}`);
    return lesson;
  });

  selectStep(index: number): void {
    this.selectedStep.set(index);
  }
}
