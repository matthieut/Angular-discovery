import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  computed,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-computed-effect',
  standalone: true,
  imports: [
    FormsModule,
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './computed-effect.html',
  styleUrl: './computed-effect.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComputedEffect {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly firstName = signal('Ada');
  readonly lastName = signal('Lovelace');
  readonly fullName = computed(() => `${this.firstName()} ${this.lastName()}`.trim());
  readonly logs = signal<string[]>([]);
  readonly code = `readonly firstName = signal('Ada');
readonly lastName = signal('Lovelace');
readonly fullName = computed(() => \`${'${this.firstName()} ${this.lastName()}'}\`);

constructor() {
  effect(() => console.log('Profil affiché :', this.fullName()));
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Valeur dérivée',
      title: 'computed',
      description: 'Calcule une valeur à partir d’autres signals et la mémorise.',
      points: [
        'Lecture sans effet externe',
        'Recalcul uniquement si nécessaire',
        'À privilégier pour une dérivation',
      ],
      recommended: true,
    },
    {
      badge: 'Effet externe',
      title: 'effect',
      description: 'Exécute une action lorsque ses dépendances réactives changent.',
      points: [
        'Journalisation ou synchronisation',
        'Asynchrone pendant la détection',
        'Ne doit pas dériver un état',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "computed crée une valeur en lecture seule calculée à partir d'autres signals. effect exécute une action lorsque les signals lus dans sa fonction changent.",
    why: "Une valeur dérivée ne doit pas être stockée et synchronisée manuellement. computed garantit qu'elle correspond toujours à ses sources. effect sert lorsque le changement doit produire une action extérieure, par exemple écrire dans le stockage local.",
    steps: [
      'computed exécute sa fonction lors de la première lecture.',
      'Angular mémorise les signals lus pendant ce calcul.',
      'Quand une source change, le computed est marqué comme devant être recalculé.',
      'effect suit également ses lectures mais exécute une action au lieu de renvoyer une valeur.',
    ],
    demoGuide: [
      'Modifie le prénom ou le nom : fullName se recalcule automatiquement.',
      'Tu ne modifies jamais fullName directement.',
      "Chaque changement ajoute une trace simulant l'effect de journalisation.",
      'Le compteur de traces illustre un effet externe, pas une donnée à afficher.',
    ],
    useCases: [
      { title: 'computed', description: 'Total, filtre, état de validation ou libellé dérivé.' },
      {
        title: 'effect',
        description: 'Journalisation, stockage local ou synchronisation avec une API non réactive.',
      },
    ],
    mistakes: [
      'Utiliser effect pour copier un signal dans un autre signal.',
      'Déclencher des modifications en boucle depuis un effect.',
      'Effectuer un calcul coûteux dans une méthode de template plutôt que dans computed.',
    ],
    takeaway:
      'Si tu veux obtenir une valeur, utilise computed. Si tu veux provoquer une action extérieure, utilise effect.',
    exercises: [
      'Ajoute un computed initials.',
      'Empêche fullName de contenir des espaces inutiles.',
      'Remplace un effect de copie par un computed.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'computed(() => ...)',
      explanation:
        'Crée un signal en lecture seule dont Angular suit automatiquement les dépendances.',
    },
    {
      code: 'this.firstName()',
      explanation: 'Cette lecture enregistre firstName comme dépendance de fullName.',
    },
    {
      code: 'effect(() => ...)',
      explanation:
        'Enregistre une fonction relancée lorsque l’une de ses lectures réactives change.',
    },
    {
      code: 'console.log(...)',
      explanation:
        'Représente ici une action extérieure ; la console ne constitue pas un nouvel état dérivé.',
    },
  ];
  constructor() {
    effect(() => {
      const name = this.fullName();
      untracked(() =>
        this.logs.update((items) => [`Profil affiché : ${name}`, ...items].slice(0, 4)),
      );
    });
  }
}
