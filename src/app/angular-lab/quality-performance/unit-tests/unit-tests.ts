import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
interface TestResult {
  name: string;
  status: 'idle' | 'passed' | 'failed';
}
@Component({
  selector: 'app-unit-tests-concept',
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
  templateUrl: './unit-tests.html',
  styleUrl: './unit-tests.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitTestsConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly broken = signal(false);
  readonly tests = signal<TestResult[]>([
    { name: 'additionne un article', status: 'idle' },
    { name: 'calcule le total', status: 'idle' },
    { name: 'refuse une quantité négative', status: 'idle' },
  ]);
  readonly serviceCode = `export class CartService {
  total(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}`;
  readonly testCode = `describe('CartService', () => {
  let service: CartService;

  beforeEach(() => service = new CartService());

  it('calcule le total', () => {
    const result = service.total([{ price: 10 }, { price: 15 }]);
    expect(result).toBe(25);
  });
});`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Rapide',
      title: 'Test unitaire',
      description: 'Vérifie une petite unité avec des dépendances contrôlées.',
      points: ['Diagnostic précis', 'Exécution fréquente', 'Peu de réalisme navigateur'],
      recommended: true,
    },
    {
      badge: 'Intégré',
      title: 'Test de composant',
      description: 'Vérifie le template, les bindings et les interactions d’un composant.',
      points: ['TestBed', 'DOM rendu', 'Plus coûteux mais plus représentatif'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'Un test unitaire exécute automatiquement une petite partie du code avec des entrées connues puis compare le résultat obtenu au résultat attendu.',
    why: 'Une modification peut casser un comportement ancien sans erreur de compilation. Les tests décrivent les règles importantes et détectent rapidement cette régression.',
    steps: [
      "Arrange prépare l'objet et les données nécessaires.",
      "Act exécute l'action testée.",
      "Assert compare le résultat à l'attente.",
      'Le runner signale précisément le test qui échoue.',
      'Le code est corrigé sans modifier le test si la règle métier reste valide.',
    ],
    demoGuide: [
      'Lance les tests : les trois règles passent.',
      'Active Introduire une régression.',
      'Relance : le test du total échoue tandis que les autres restent verts.',
      'Ce ciblage aide à localiser la règle cassée ; la démo simule un runner.',
    ],
    useCases: [
      { title: 'Règle métier', description: 'Calcul, validation ou transformation déterministe.' },
      {
        title: 'Service',
        description: 'Vérifier les interactions avec une dépendance remplacée par un fake.',
      },
      { title: 'Composant', description: 'Tester rendu et événements avec TestBed.' },
    ],
    mistakes: [
      "Tester l'implémentation interne plutôt que le comportement observable.",
      "Mocker toutes les dépendances jusqu'à ne plus tester un scénario réaliste.",
      'Chercher un pourcentage de couverture sans protéger les règles importantes.',
    ],
    takeaway:
      'Un bon test échoue pour une raison métier précise et explique le comportement attendu.',
    exercises: [
      'Ajoute un test de panier vide.',
      'Teste une erreur levée.',
      'Remplace une API par un fake avec TestBed.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "describe('CartService', ...)",
      explanation: 'Regroupe les tests qui concernent la même unité.',
    },
    {
      code: 'beforeEach(...)',
      explanation:
        'Recrée un contexte propre avant chaque test afin d’éviter les dépendances entre tests.',
    },
    {
      code: "it('calcule le total', ...)",
      explanation: 'Décrit un comportement attendu avec un nom lisible.',
    },
    {
      code: 'expect(result).toBe(25)',
      explanation: 'Échoue si la valeur obtenue n’est pas exactement 25.',
    },
  ];
  run(): void {
    this.tests.set([
      { name: 'additionne un article', status: 'passed' },
      { name: 'calcule le total', status: this.broken() ? 'failed' : 'passed' },
      { name: 'refuse une quantité négative', status: 'passed' },
    ]);
  }
}
