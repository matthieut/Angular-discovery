import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { CodeWalkthrough } from '../../shared/code-walkthrough/code-walkthrough';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import {
  CodeWalkthroughItem,
  ConceptComparisonItem,
  ConceptLearningContent,
} from '../../shared/concept.models';

type ProviderScope = 'root' | 'component';
@Component({
  selector: 'app-dependency-injection',
  standalone: true,
  imports: [
    CodePreview,
    CodeWalkthrough,
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
  readonly localProviderCode = `@Component({
  selector: 'app-local-counter',
  standalone: true,
  providers: [CounterService],
  template: \`
    <button (click)="counter.increment()">
      {{ counter.count() }}
    </button>
  \`
})
export class LocalCounterComponent {
  readonly counter = inject(CounterService);
}`;
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
  readonly learning: ConceptLearningContent = {
    definition:
      "L'injection de dépendances permet à un composant de demander un service à Angular au lieu de le créer lui-même avec new. Angular choisit l'instance à fournir selon l'endroit où le service a été déclaré.",
    why: 'Si chaque composant construit ses services, leurs dépendances sont figées et les tests deviennent difficiles. En laissant Angular fournir les instances, on peut partager un service, isoler son état ou le remplacer par un faux pendant un test.',
    steps: [
      'Un composant demande une dépendance avec inject() ou son constructeur.',
      "Angular utilise le type ou l'InjectionToken comme clé de recherche.",
      "Il remonte les injecteurs jusqu'à trouver un provider correspondant.",
      "Il crée l'instance si nécessaire, la mémorise selon sa portée, puis la transmet au composant.",
    ],
    demoGuide: [
      'Choisis Provider root puis incrémente A : B change aussi, car ils partagent la même instance.',
      'Choisis Provider composant : les compteurs sont remis à zéro.',
      'Incrémente A : B ne change plus, car chaque composant reçoit sa propre instance.',
      "La démonstration simule la portée ; l'onglet Code montre la déclaration Angular réelle.",
    ],
    useCases: [
      {
        title: 'Service partagé',
        description: 'Client API, authentification ou façade métier utilisée dans plusieurs pages.',
      },
      {
        title: 'Configuration',
        description: 'InjectionToken pour une URL ou une option qui n’est pas une classe.',
      },
      {
        title: 'État local',
        description:
          'Provider de composant lorsque chaque sous-arbre doit posséder sa propre instance.',
      },
    ],
    mistakes: [
      'Ajouter un service stateful dans providers de plusieurs composants sans vouloir isoler son état.',
      "Créer manuellement un service avec new et contourner l'injecteur.",
      'Utiliser providedIn root pour un état qui devrait disparaître avec le composant.',
    ],
    takeaway:
      "L'endroit où tu déclares le provider détermine qui partage l'instance et combien de temps elle reste en vie.",
    exercises: [
      'Crée un InjectionToken de configuration.',
      'Remplace un service par un fake dans un test.',
      'Déplace un provider de root vers le composant et observe son état.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "@Injectable({ providedIn: 'root' })",
      explanation:
        "Enregistre automatiquement le service dans l'injecteur principal et permet de l'éliminer du bundle s'il n'est jamais utilisé.",
    },
    {
      code: 'inject(CounterService)',
      explanation: "Demande à l'injecteur actif l'instance associée à CounterService.",
    },
    {
      code: 'providers: [CounterService]',
      explanation:
        'Crée une instance locale pour ce composant et son sous-arbre. Deux LocalCounterComponent reçoivent donc deux instances différentes.',
    },
    {
      code: "new InjectionToken<string>('API_URL')",
      explanation:
        "Crée une clé typée pour injecter une valeur qui n'est pas représentée par une classe.",
    },
    { code: 'provide: API_URL', explanation: 'Indique quel token ce provider sait résoudre.' },
    {
      code: 'useValue: environment.apiUrl',
      explanation: "Indique la valeur renvoyée lorsqu'un composant demande API_URL.",
    },
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
