import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ConceptLevel = 'Fondamental' | 'Intermédiaire' | 'Avancé';

@Component({
  selector: 'app-concept-header',
  standalone: true,
  templateUrl: './concept-header.html',
  styleUrl: './concept-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptHeader {
  readonly category = input.required<string>();
  readonly sheetNumber = input.required<number>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly level = input.required<ConceptLevel>();
}
