import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  templateUrl: './demo-header.html',
  styleUrl: './demo-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoHeader {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly badge = input('Interactif');
}
