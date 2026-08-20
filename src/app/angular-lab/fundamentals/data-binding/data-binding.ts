import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import { ConceptComparisonItem, ConceptUseCase } from '../../shared/concept.models';

@Component({
  selector: 'app-data-binding',
  standalone: true,
  imports: [
    FormsModule,
    CodePreview,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './data-binding.html',
  styleUrl: './data-binding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataBinding {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly name = signal('Angular');
  readonly count = signal(0);
  readonly locked = signal(false);
  readonly status = computed(() => (this.locked() ? 'désactivé' : 'actif'));
  readonly code = `<h3>{{ name() }}</h3>
<button [disabled]="locked()" (click)="increment()">{{ count() }}</button>
<input [ngModel]="name()" (ngModelChange)="name.set($event)" />`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Flux explicite',
      title: 'Binding unidirectionnel',
      description: 'La donnée descend et les événements remontent séparément.',
      points: ['Flux traçable', 'Débogage plus simple', 'Privilégier pour les composants'],
      recommended: true,
    },
    {
      badge: 'Formulaire',
      title: 'Binding bidirectionnel',
      description: 'La valeur et sa mise à jour sont regroupées dans une syntaxe.',
      points: ['Pratique pour les champs', 'Écriture concise', 'Peut masquer le flux'],
    },
  ];
  readonly useCases: ConceptUseCase[] = [
    { title: 'Affichage', description: 'Interpolation pour produire du texte.' },
    { title: 'Propriété DOM', description: 'Property binding pour synchroniser un état.' },
    { title: 'Interaction', description: 'Event binding pour traiter une action utilisateur.' },
  ];
}
