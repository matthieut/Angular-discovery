import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  selector: 'app-signals',
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
  templateUrl: './signals.html',
  styleUrl: './signals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signals {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly product = signal('Formation Angular');
  readonly quantity = signal(1);
  readonly available = signal(true);
  readonly componentCode = `export class CartLineComponent {
  readonly product = signal('Formation Angular');
  readonly quantity = signal(1);
  readonly available = signal(true);

  increment(): void {
    this.quantity.update(value => value + 1);
  }
}`;
  readonly templateCode = `<h3>{{ product() }}</h3>
<p>Quantité : {{ quantity() }}</p>
<button (click)="quantity.update(value => value + 1)">Ajouter</button>
<button (click)="available.set(false)">Rendre indisponible</button>`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Réactif',
      title: 'Signal',
      description:
        'Angular sait quels templates lisent cette valeur et les actualise lorsqu’elle change.',
      points: [
        'Lecture avec ()',
        'Mise à jour avec set/update',
        'Dépendances suivies automatiquement',
      ],
      recommended: true,
    },
    {
      badge: 'Valeur simple',
      title: 'Propriété classique',
      description:
        'Une propriété TypeScript reste valable lorsqu’aucun suivi réactif précis n’est nécessaire.',
      points: [
        'Syntaxe familière',
        'Pas d’API réactive',
        'Peut nécessiter plus de précautions avec OnPush',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Un signal est une boîte réactive qui contient une valeur. Le composant peut lire cette valeur, la remplacer ou la calculer à partir de sa valeur précédente. Angular mémorise les endroits qui la lisent afin d'actualiser l'interface lorsqu'elle change.",
    why: 'Une interface affiche des données qui évoluent : compteur, filtre, utilisateur sélectionné. Les signals rendent ces changements explicites et permettent à Angular de savoir précisément quelles parties doivent être recalculées.',
    steps: [
      'signal(valeurInitiale) crée la boîte réactive.',
      'Le template lit sa valeur en appelant le signal avec ().',
      'set remplace entièrement la valeur.',
      "update reçoit l'ancienne valeur et renvoie la suivante.",
      'Angular rafraîchit les expressions du template qui ont lu ce signal.',
    ],
    demoGuide: [
      'Modifie le nom : product.set reçoit la nouvelle chaîne.',
      'Clique sur Ajouter : quantity.update utilise la quantité précédente.',
      'Change la disponibilité : available.set remplace le booléen.',
      'Observe que seules les valeurs liées sont mises à jour, sans manipulation directe du DOM.',
    ],
    useCases: [
      {
        title: 'État local',
        description: 'Sélection, compteur, filtre ou ouverture d’un panneau.',
      },
      { title: 'État partagé', description: 'État exposé par un service à plusieurs composants.' },
    ],
    mistakes: [
      "Oublier les parenthèses lors de la lecture d'un signal.",
      'Modifier un objet ou un tableau en place sans fournir une nouvelle valeur.',
      "Transformer toutes les constantes en signals alors qu'elles ne changent jamais.",
    ],
    takeaway:
      'Lis avec signal(), remplace avec set(), transforme la valeur précédente avec update().',
    exercises: [
      'Ajoute un bouton Retirer sans descendre sous zéro.',
      'Stocke un objet produit dans un signal et remplace-le sans mutation.',
      'Affiche un message différent selon available.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "signal('Formation Angular')",
      explanation: 'Crée un WritableSignal<string> contenant la valeur initiale.',
    },
    {
      code: 'product()',
      explanation: 'Lit la valeur actuelle et enregistre le template comme consommateur réactif.',
    },
    {
      code: 'available.set(false)',
      explanation: 'Remplace directement la valeur du signal par false.',
    },
    {
      code: 'quantity.update(value => value + 1)',
      explanation:
        'Calcule la nouvelle quantité à partir de la précédente, sans lire puis écrire séparément.',
    },
  ];
  decrement(): void {
    this.quantity.update((value) => Math.max(0, value - 1));
  }
}
