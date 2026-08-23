import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-concept-pagination',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './concept-pagination.html',
  styleUrl: './concept-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptPagination {
  readonly current = input.required<number>();
  readonly total = input(76);
  readonly previousRoute = input<string>();
  readonly nextRoute = input<string>();
}
