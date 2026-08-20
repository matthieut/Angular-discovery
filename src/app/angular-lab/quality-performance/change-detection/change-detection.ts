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
@Component({
  selector: 'app-change-detection-concept',
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
  templateUrl: './change-detection.html',
  styleUrl: './change-detection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetectionConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly first = signal(0);
  readonly second = signal(0);
  readonly firstLabel = computed(() => `Valeur A : ${this.first()}`);
  readonly secondLabel = computed(() => `Valeur B : ${this.second()}`);
  readonly code = `@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<button (click)="count.update(v => v + 1)">{{ count() }}</button>'
})
export class CounterComponent {
  readonly count = signal(0);
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Prévisible',
      title: 'OnPush + signals',
      description:
        'Le composant est vérifié lorsque ses entrées ou ses dépendances réactives le nécessitent.',
      points: ['Dépendances explicites', 'Bon défaut moderne', 'Moins de vérifications inutiles'],
      recommended: true,
    },
    {
      badge: 'Large',
      title: 'Détection par défaut',
      description: 'Angular vérifie plus largement l’arbre après les événements pris en charge.',
      points: [
        'Simple historiquement',
        'Tolère davantage de mutations',
        'Travail potentiellement inutile',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'La détection de changements est le mécanisme par lequel Angular vérifie les données utilisées par un template puis met le DOM à jour si leur résultat a changé.',
    why: "Le navigateur ne sait pas qu'une propriété TypeScript représente du texte à l'écran. Angular doit décider quand relire les expressions du template sans refaire inutilement tout le travail.",
    steps: [
      "Une interaction, une entrée ou une notification réactive signale qu'un état peut avoir changé.",
      'Angular détermine quels composants doivent être vérifiés.',
      'Il réévalue les expressions de leurs templates.',
      'Il compare les résultats avec le rendu précédent.',
      'Il modifie uniquement les nœuds DOM dont la valeur a changé.',
    ],
    demoGuide: [
      'Les deux cartes lisent deux signals différents.',
      'Incrémente A : seul le texte dépendant de first change visuellement.',
      'Le computed A ne lit pas second et inversement.',
      'La démonstration illustre les dépendances ; Angular DevTools mesure les vérifications réelles.',
    ],
    useCases: [
      {
        title: 'OnPush',
        description: 'Choix recommandé pour des composants aux entrées explicites.',
      },
      {
        title: 'Signals',
        description: 'Notifier précisément Angular qu’une valeur lue par le template a changé.',
      },
    ],
    mistakes: [
      "Muter un objet d'entrée et conserver la même référence.",
      'Appeler une fonction coûteuse depuis le template.',
      "Utiliser detectChanges pour masquer une mauvaise circulation de l'état.",
    ],
    takeaway:
      'OnPush ne bloque pas les mises à jour : il demande des signaux clairs comme une nouvelle entrée, un événement ou un signal modifié.',
    exercises: [
      'Passe un objet en input et compare mutation et nouvelle référence.',
      'Observe les composants avec Angular DevTools.',
      'Remplace une méthode de template par computed.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'ChangeDetectionStrategy.OnPush',
      explanation:
        'Limite les vérifications automatiques du composant à des déclencheurs explicites.',
    },
    {
      code: 'count = signal(0)',
      explanation: 'Crée une source réactive que le template peut suivre.',
    },
    { code: 'count()', explanation: 'Enregistre la dépendance du template à ce signal.' },
    {
      code: 'count.update(...)',
      explanation: 'Notifie Angular de la nouvelle valeur et planifie le rendu concerné.',
    },
  ];
}
