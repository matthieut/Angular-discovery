import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ConceptTab = 'demo' | 'code' | 'comparison';

@Component({
  selector: 'app-concept-tabs',
  standalone: true,
  templateUrl: './concept-tabs.html',
  styleUrl: './concept-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptTabs {
  readonly activeTab = input.required<ConceptTab>();
  readonly tabChange = output<ConceptTab>();
  readonly iconPath = '/icons/lab';
}
