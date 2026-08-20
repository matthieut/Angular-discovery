import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject, scan, startWith } from 'rxjs';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { CodeWalkthrough } from '../../shared/code-walkthrough/code-walkthrough';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import { signal } from '@angular/core';
import {
  CodeWalkthroughItem,
  ConceptComparisonItem,
  ConceptLearningContent,
} from '../../shared/concept.models';
type CounterAction = 'increment' | 'decrement' | 'reset';
@Component({
  selector: 'app-rxjs-observables',
  standalone: true,
  imports: [
    AsyncPipe,
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './rxjs-observables.html',
  styleUrl: './rxjs-observables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsObservables {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly actions$ = new Subject<CounterAction>();
  readonly count$ = this.actions$.pipe(
    scan(
      (count, action) =>
        action === 'reset' ? 0 : action === 'increment' ? count + 1 : Math.max(0, count - 1),
      0,
    ),
    startWith(0),
  );
  readonly code = `readonly actions$ = new Subject<'increment' | 'decrement' | 'reset'>();

readonly count$ = this.actions$.pipe(
  scan((count, action) => {
    if (action === 'reset') return 0;
    return action === 'increment' ? count + 1 : Math.max(0, count - 1);
  }, 0),
  startWith(0)
);`;
  readonly templateCode = `<p>Compteur : {{ count$ | async }}</p>
<button (click)="actions$.next('increment')">Ajouter</button>
<button (click)="actions$.next('reset')">Réinitialiser</button>`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Flux dans le temps',
      title: 'Observable',
      description: 'Peut produire zéro, une ou plusieurs valeurs puis se terminer ou échouer.',
      points: [
        'Opérateurs de transformation',
        'Annulation par désabonnement',
        'Idéal pour HTTP, événements et flux async',
      ],
      recommended: true,
    },
    {
      badge: 'Producteur manuel',
      title: 'Subject',
      description: 'Observable auquel le code peut pousser des valeurs avec next.',
      points: [
        'Multicast',
        'Utile comme frontière événementielle',
        'À ne pas exposer publiquement sans contrôle',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Un Observable représente une suite de valeurs qui peuvent arriver dans le temps. Rien n'est reçu tant qu'un consommateur ne s'abonne pas. RxJS fournit des opérateurs pour transformer, filtrer et combiner cette suite.",
    why: "Les résultats HTTP, événements utilisateur, WebSockets ou délais ne sont pas toujours disponibles immédiatement. Un Observable décrit comment ces valeurs seront traitées lorsqu'elles arriveront.",
    steps: [
      'Un producteur crée ou émet des valeurs.',
      'pipe compose les opérateurs appliqués au flux.',
      "Un abonnement démarre l'écoute de l'Observable.",
      'Chaque valeur traverse les opérateurs puis arrive au consommateur.',
      "Le désabonnement arrête l'écoute lorsque le flux ne se termine pas seul.",
    ],
    demoGuide: [
      'Chaque bouton envoie une action dans actions$ avec next.',
      'scan conserve le compteur précédent et calcule le suivant, comme reduce au fil du temps.',
      'startWith fournit immédiatement la valeur zéro.',
      "async s'abonne dans le template et se désabonne avec le composant.",
    ],
    useCases: [
      { title: 'HTTP', description: 'Recevoir une réponse asynchrone et gérer succès ou erreur.' },
      { title: 'Événements', description: 'Filtrer, regrouper ou temporiser des interactions.' },
      {
        title: 'Temps réel',
        description: 'Traiter des valeurs successives provenant d’un WebSocket.',
      },
    ],
    mistakes: [
      "S'abonner dans plusieurs endroits sans stratégie de désabonnement.",
      "Imbriquer des subscribe au lieu d'utiliser switchMap ou concatMap.",
      "Utiliser un Subject comme stockage global modifiable par n'importe quel composant.",
    ],
    takeaway: 'Un Observable est une recette de flux ; subscribe ou async démarre sa consommation.',
    exercises: [
      'Ajoute une action decrement.',
      'Ajoute tap pour journaliser les actions.',
      'Remplace async par takeUntilDestroyed dans le composant et compare.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'new Subject<CounterAction>()',
      explanation:
        'Crée une source qui est à la fois Observable et capable de recevoir des valeurs avec next.',
    },
    {
      code: 'actions$.pipe(...)',
      explanation:
        'Construit un nouvel Observable en appliquant des opérateurs sans modifier la source.',
    },
    {
      code: 'scan(..., 0)',
      explanation:
        'Conserve un état entre les émissions et produit un nouveau compteur pour chaque action.',
    },
    {
      code: 'startWith(0)',
      explanation: 'Émet zéro immédiatement lors de chaque nouvel abonnement.',
    },
    {
      code: 'count$ | async',
      explanation:
        'Le pipe async s’abonne, affiche la dernière valeur et se désabonne automatiquement.',
    },
  ];
}
