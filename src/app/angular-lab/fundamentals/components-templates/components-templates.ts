import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import { ConceptComparisonItem, ConceptUseCase } from '../../shared/concept.models';

@Component({
  selector: 'app-components-templates',
  standalone: true,
  imports: [
    CodePreview,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './components-templates.html',
  styleUrl: './components-templates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsTemplates {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly showDetails = signal(true);
  readonly technologies = ['Angular', 'TypeScript', 'SCSS'];
  readonly componentCode = `@Component({
  selector: 'app-profile-card',
  standalone: true,
  templateUrl: './profile-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCard {
  readonly name = input.required<string>();
  readonly showDetails = input(true);
}`;
  readonly templateCode = `<article class="profile-card">
  <h3>{{ name() }}</h3>
  @if (showDetails()) {
    <ul>
      @for (technology of technologies; track technology) {
        <li>{{ technology }}</li>
      }
    </ul>
  }
</article>`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Par défaut',
      title: 'Template externe',
      description: 'Le HTML reste séparé du comportement du composant.',
      points: ['Lisible sur les vues riches', 'Outils HTML efficaces', 'Responsabilités visibles'],
      recommended: true,
    },
    {
      badge: 'Cas compact',
      title: 'Template inline',
      description: 'Le template vit dans le décorateur du composant.',
      points: ['Pratique pour quelques lignes', 'Fichier unique', 'Devient vite illisible'],
    },
  ];
  readonly useCases: ConceptUseCase[] = [
    {
      title: 'Interface réutilisable',
      description: 'Isoler une responsabilité UI avec une API claire.',
    },
    {
      title: 'Page métier',
      description: 'Composer plusieurs composants spécialisés plutôt qu’un composant géant.',
    },
  ];
}
