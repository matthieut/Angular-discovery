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
interface CartItem {
  id: number;
  name: string;
  price: number;
}
@Component({
  selector: 'app-state-management-concept',
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
  templateUrl: './state-management.html',
  styleUrl: './state-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly catalogue: CartItem[] = [
    { id: 1, name: 'Livre Angular', price: 35 },
    { id: 2, name: 'Formation RxJS', price: 60 },
  ];
  readonly cart = signal<CartItem[]>([]);
  readonly total = computed(() => this.cart().reduce((sum, item) => sum + item.price, 0));
  readonly code = `@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );

  add(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Simple',
      title: 'Service avec signals',
      description: 'Convient à un état partagé de complexité limitée et à des actions directes.',
      points: ['Peu de dépendances', 'API contrôlée', 'Dérivations avec computed'],
      recommended: true,
    },
    {
      badge: 'Complexe',
      title: 'Store structuré',
      description: 'Ajoute conventions, événements et outils pour un domaine volumineux.',
      points: ['Traçabilité', 'Effets organisés', 'Coût conceptuel supplémentaire'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "L'état est l'ensemble des données dont l'interface dépend à un instant donné. Gérer l'état consiste à décider qui le possède, qui peut le modifier et comment les autres parties lisent ses dérivations.",
    why: 'Lorsque plusieurs composants modifient directement les mêmes données, les changements deviennent difficiles à suivre. Une source de vérité et des actions explicites réduisent les incohérences.',
    steps: [
      "Une classe possède l'état modifiable dans un signal privé.",
      'Elle expose une version en lecture seule aux consommateurs.',
      'Des méthodes décrivent les modifications autorisées.',
      'computed produit les valeurs dérivées comme le total.',
      "Les composants appellent les actions et affichent l'état sans le muter directement.",
    ],
    demoGuide: [
      'Ajoute un produit depuis le catalogue.',
      'Le tableau cart est remplacé par une nouvelle valeur.',
      'Le computed total est recalculé automatiquement.',
      'Vider le panier passe également par une action explicite.',
    ],
    useCases: [
      {
        title: 'État local',
        description: 'Rester dans le composant si personne d’autre n’en dépend.',
      },
      {
        title: 'État de feature',
        description: 'Service fourni au niveau de la route ou de la feature.',
      },
      {
        title: 'État global',
        description: 'Session ou préférences réellement partagées dans toute l’application.',
      },
    ],
    mistakes: [
      "Mettre tout l'état dans un store global.",
      "Exposer directement un WritableSignal et autoriser n'importe quel composant à le modifier.",
      "Stocker une valeur dérivable au lieu d'utiliser computed.",
    ],
    takeaway:
      "Place l'état au niveau le plus local possible et expose des actions plutôt que la mutation directe.",
    exercises: [
      'Ajoute une action remove.',
      'Empêche les doublons avec une quantité.',
      "Fournis le store au niveau d'une route plutôt qu'en root.",
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'private readonly _items',
      explanation: 'Le signal modifiable reste inaccessible aux composants consommateurs.',
    },
    {
      code: 'asReadonly()',
      explanation: 'Expose uniquement la lecture du signal, sans set ni update.',
    },
    {
      code: 'computed(() => ...)',
      explanation: 'Évite de stocker et synchroniser manuellement le total.',
    },
    {
      code: 'update(items => [...items, item])',
      explanation: 'Produit un nouveau tableau au lieu de muter la valeur actuelle.',
    },
  ];
  add(item: CartItem): void {
    this.cart.update((items) => [...items, item]);
  }
}
