import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs';
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
  selector: 'app-interop-signals-rxjs',
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
  templateUrl: './interop-signals-rxjs.html',
  styleUrl: './interop-signals-rxjs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteropSignalsRxjs {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly query = signal('');
  readonly technologies = ['Angular', 'Signals', 'RxJS', 'TypeScript', 'PrimeNG'];
  readonly query$ = toObservable(this.query);
  readonly results = toSignal(
    this.query$.pipe(
      debounceTime(300),
      map((query) =>
        this.technologies.filter((item) => item.toLowerCase().includes(query.toLowerCase())),
      ),
    ),
    { initialValue: this.technologies },
  );
  readonly code = `readonly query = signal('');
readonly query$ = toObservable(this.query);

readonly results = toSignal(
  this.query$.pipe(
    debounceTime(300),
    map(query => this.technologies.filter(item => item.includes(query)))
  ),
  { initialValue: this.technologies }
);`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'État synchrone',
      title: 'Signal',
      description: 'Expose immédiatement une valeur actuelle au template.',
      points: ['Lecture simple', 'Dépendances fines', 'Idéal pour l’état UI'],
      recommended: true,
    },
    {
      badge: 'Flux asynchrone',
      title: 'Observable',
      description: 'Décrit des valeurs dans le temps et propose de nombreux opérateurs.',
      points: ['Annulation et erreurs', 'Composition temporelle', 'Idéal pour HTTP et événements'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "L'interopérabilité permet de convertir un signal en Observable avec toObservable, ou un Observable en signal avec toSignal. Elle sert de pont lorsqu'une partie de l'application utilise l'état synchrone Angular et une autre les opérateurs RxJS.",
    why: "L'interface préfère souvent lire une valeur actuelle comme un signal, tandis qu'une recherche temporisée ou un appel HTTP se compose mieux avec RxJS. Le pont évite les abonnements manuels uniquement destinés à recopier une valeur.",
    steps: [
      'query est un signal mis à jour par le champ.',
      'toObservable crée un flux qui émet lorsque query change.',
      "debounceTime attend que l'utilisateur cesse de taper.",
      'map transforme le texte en résultats filtrés.',
      'toSignal conserve la dernière liste afin que le template puisse la lire avec results().',
    ],
    demoGuide: [
      'Tape rapidement dans le champ de recherche.',
      'Le champ met à jour query immédiatement.',
      'La liste attend 300 ms grâce à debounceTime.',
      "results() affiche ensuite la dernière valeur produite par l'Observable.",
    ],
    useCases: [
      {
        title: 'Recherche',
        description: 'Signal pour la saisie, RxJS pour debounce et requête, signal pour le rendu.',
      },
      {
        title: 'Migration',
        description:
          'Connecter progressivement un service Observable à des composants basés sur signals.',
      },
    ],
    mistakes: [
      'Convertir plusieurs fois le même flux dans différents composants.',
      'Oublier initialValue lorsque le template attend une valeur immédiatement.',
      "Utiliser toObservable alors qu'un computed suffirait pour un calcul synchrone.",
    ],
    takeaway:
      "Garde les signals pour l'état courant de l'interface et RxJS pour les flux asynchrones ou temporels ; convertis uniquement à leur frontière.",
    exercises: [
      'Ajoute distinctUntilChanged au flux.',
      'Simule un appel HTTP avec switchMap.',
      'Compare ce filtre avec un simple computed sans debounce.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'toObservable(this.query)',
      explanation: 'Crée un Observable qui émet les valeurs stabilisées du signal query.',
    },
    {
      code: 'debounceTime(300)',
      explanation: 'Attend 300 ms sans nouvelle émission avant de laisser passer la valeur.',
    },
    {
      code: 'map(query => ...)',
      explanation: 'Transforme chaque texte reçu en une liste filtrée.',
    },
    {
      code: 'toSignal(observable, ...)',
      explanation:
        'Souscrit au flux dans le contexte Angular et expose sa dernière émission sous forme de signal.',
    },
    {
      code: 'initialValue',
      explanation: 'Fournit la valeur disponible avant la première émission de l’Observable.',
    },
  ];
}
