import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConceptComparisonItem } from '../concept.models';

@Component({
  selector: 'app-concept-comparison',
  standalone: true,
  templateUrl: './concept-comparison.html',
  styleUrl: './concept-comparison.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptComparison {
  readonly items = input.required<ConceptComparisonItem[]>();
}
