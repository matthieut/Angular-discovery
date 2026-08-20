import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConceptUseCase } from '../concept.models';

@Component({
  selector: 'app-concept-learning',
  standalone: true,
  templateUrl: './concept-learning.html',
  styleUrl: './concept-learning.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptLearning {
  readonly iconPath = '/icons/lab';
  readonly introduction = input.required<string>();
  readonly points = input.required<string[]>();
  readonly useCases = input.required<ConceptUseCase[]>();
  readonly recommendation = input.required<string>();
  readonly exercises = input.required<string[]>();
}
