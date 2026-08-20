import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConceptLearningContent } from '../concept.models';

@Component({
  selector: 'app-concept-learning',
  standalone: true,
  templateUrl: './concept-learning.html',
  styleUrl: './concept-learning.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptLearning {
  readonly iconPath = '/icons/lab';
  readonly content = input.required<ConceptLearningContent>();
}
