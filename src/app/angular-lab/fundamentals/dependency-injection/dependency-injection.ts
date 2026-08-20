import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import { ConceptComparisonItem, ConceptUseCase } from '../../shared/concept.models';

type ProviderScope = 'root' | 'component';
@Component({
  selector: 'app-dependency-injection',
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
  templateUrl: './dependency-injection.html',
  styleUrl: './dependency-injection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyInjection {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly scope = signal<ProviderScope>('root');
  readonly rootCount = signal(0);
  readonly leftCount = signal(0);
  readonly rightCount = signal(0);
  readonly leftValue = computed(() =>
    this.scope() === 'root' ? this.rootCount() : this.leftCount(),
  );
  readonly rightValue = computed(() =>
    this.scope() === 'root' ? this.rootCount() : this.rightCount(),
  );
  readonly serviceCode = `@Injectable({ providedIn: 'root' })
export class CounterService {
  readonly count = signal(0);
  increment(): void { this.count.update(value => value + 1); }
}`;
  readonly tokenCode = `export const API_URL = new InjectionToken<string>('API_URL');

bootstrapApplication(AppComponent, {
  providers: [{ provide: API_URL, useValue: environment.apiUrl }]
});`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Partagé',
      title: "providedIn: 'root'",
      description: 'Une instance paresseuse partagée dans l’application.',
      points: [
        'Singleton applicatif',
        'Tree-shakable',
        'Choix par défaut pour les services sans état local',
      ],
      recommended: true,
    },
    {
      badge: 'Isolé',
      title: 'providers du composant',
      description: 'Une nouvelle instance dans chaque sous-arbre concerné.',
      points: [
        'État local isolé',
        'Durée de vie liée au composant',
        'À utiliser intentionnellement',
      ],
    },
  ];
  readonly useCases: ConceptUseCase[] = [
    { title: 'Service transversal', description: 'Client API, authentification ou façade métier.' },
    {
      title: 'Configuration',
      description: 'InjectionToken pour une valeur non classée et substituable.',
    },
    { title: 'État local', description: 'Provider de composant pour isoler une instance.' },
  ];
  increment(side: 'left' | 'right'): void {
    if (this.scope() === 'root') this.rootCount.update((v) => v + 1);
    else (side === 'left' ? this.leftCount : this.rightCount).update((v) => v + 1);
  }
  changeScope(scope: ProviderScope): void {
    this.scope.set(scope);
    this.rootCount.set(0);
    this.leftCount.set(0);
    this.rightCount.set(0);
  }
}
