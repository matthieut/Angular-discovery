import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  selector: 'app-data-binding',
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
  readonly customTwoWayCode = `export class RatingInput {
  readonly value = input.required<number>();
  readonly valueChange = output<number>();
}

// [(value)] se décompose ainsi :
<rating-input [value]="rating()" (valueChange)="rating.set($event)" />`;
  readonly reactiveFormCode = `readonly form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  })
});

<form [formGroup]="form"><input formControlName="email" /></form>`;
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
  readonly learning: ConceptLearningContent = {
    definition:
      "Le data binding est le lien entre les données de la classe TypeScript et le HTML. Il permet d'afficher une valeur, de modifier une propriété du DOM ou de réagir à une action de l'utilisateur.",
    why: "Sans binding, il faudrait rechercher manuellement les éléments avec document.querySelector puis modifier le DOM. Angular garde l'interface synchronisée avec l'état du composant de manière déclarative.",
    steps: [
      'Le composant possède une valeur, par exemple name.',
      'Le template lit cette valeur avec une syntaxe de binding.',
      'Angular affiche ou applique la valeur au DOM.',
      "Un événement peut ensuite modifier l'état, ce qui actualise le template.",
      'Un binding personnalisé associe une entrée value à une sortie valueChange ; [(value)] combine les deux.',
    ],
    demoGuide: [
      "Écris dans le champ : name change et l'interpolation Bonjour ... est immédiatement recalculée.",
      'Clique sur Verrouiller : le signal locked passe à true.',
      'Le property binding [disabled] désactive alors le bouton compteur.',
      "Quand le bouton est actif, (click) modifie count : c'est un event binding.",
    ],
    useCases: [
      { title: 'Afficher du texte', description: 'Utiliser l’interpolation {{ valeur }}.' },
      { title: 'Piloter le DOM', description: 'Utiliser [disabled], [class] ou [value].' },
      {
        title: 'Traiter une action',
        description: 'Utiliser (click), (input) ou un événement de composant.',
      },
    ],
    mistakes: [
      "Utiliser l'interpolation pour une propriété booléenne comme disabled.",
      "Modifier directement le DOM alors qu'un binding suffit.",
      'Employer le two-way binding partout et rendre le sens des mises à jour difficile à suivre.',
      'Gérer un formulaire métier complexe avec des variables dispersées plutôt qu’un modèle réactif explicite.',
    ],
    takeaway:
      'Les crochets envoient une valeur vers le DOM ; les parenthèses font remonter un événement vers le composant.',
    exercises: [
      'Ajoute un bouton de remise à zéro du compteur.',
      'Remplace ngModel par [value] et (input).',
      'Ajoute une classe lorsque count dépasse 5.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: '{{ name() }}',
      explanation:
        "Interpolation : Angular convertit le résultat en texte et l'insère dans le HTML.",
    },
    {
      code: '[disabled]="locked()"',
      explanation: 'Property binding : la propriété disabled du bouton reçoit un booléen.',
    },
    {
      code: '(click)="increment()"',
      explanation:
        "Event binding : Angular appelle increment lorsque le navigateur émet l'événement click.",
    },
    {
      code: '[ngModel]="name()"',
      explanation: 'Envoie la valeur actuelle du signal vers le champ.',
    },
    {
      code: '(ngModelChange)="name.set($event)"',
      explanation: 'Récupère la nouvelle valeur saisie et la stocke dans le signal.',
    },
  ];
}
