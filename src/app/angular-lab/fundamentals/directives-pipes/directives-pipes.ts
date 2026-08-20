import { UpperCasePipe } from '@angular/common';
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
import { HighlightDirective } from './highlight.directive';
import { InitialsPipe } from './initials.pipe';

@Component({
  selector: 'app-directives-pipes',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    HighlightDirective,
    InitialsPipe,
    CodePreview,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './directives-pipes.html',
  styleUrl: './directives-pipes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesPipes {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly query = signal('');
  readonly highlight = signal(true);
  readonly members = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  readonly visibleMembers = computed(() =>
    this.members.filter((member) => member.toLowerCase().includes(this.query().toLowerCase())),
  );
  readonly templateCode = `@for (member of visibleMembers(); track member) {
  <article [appHighlight]="highlight()">
    <span>{{ member | initials }}</span>
    <strong>{{ member | uppercase }}</strong>
  </article>
} @empty {
  <p>Aucun résultat</p>
}`;
  readonly pipeCode = `@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    return value.split(/\\s+/).map(part => part[0]).join('').slice(0, 2);
  }
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Transformation',
      title: 'Pipe pur',
      description: 'Transforme une valeur sans modifier sa source.',
      points: ['Mémorisable par Angular', 'Déterministe', 'Idéal pour la présentation'],
      recommended: true,
    },
    {
      badge: 'Comportement DOM',
      title: 'Directive attribut',
      description: 'Ajoute un comportement à un élément existant.',
      points: ['Réutilisable', 'Pas de nouveau DOM', 'Entrées configurables'],
    },
  ];
  readonly useCases: ConceptUseCase[] = [
    { title: 'Formatage', description: 'Dates, devises, libellés et représentations.' },
    {
      title: 'Comportement transversal',
      description: 'Focus, permission, surbrillance ou observation.',
    },
  ];
}
