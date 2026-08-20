import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeWalkthroughItem } from '../concept.models';

@Component({
  selector: 'app-code-walkthrough',
  standalone: true,
  templateUrl: './code-walkthrough.html',
  styleUrl: './code-walkthrough.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeWalkthrough {
  readonly title = input('Lecture guidée');
  readonly items = input.required<CodeWalkthroughItem[]>();
}
