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
@Component({
  selector: 'app-e2e-tests-concept',
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
  templateUrl: './e2e-tests.html',
  styleUrl: './e2e-tests.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class E2eTestsConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly currentStep = signal(0);
  readonly steps = [
    'Ouvrir /login',
    'Saisir les identifiants',
    'Cliquer sur Se connecter',
    'Vérifier /dashboard',
  ];
  readonly code = `test('un utilisateur se connecte', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.fr');
  await page.getByLabel('Mot de passe').fill('secret-valide');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible();
});`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Parcours',
      title: 'Test end-to-end',
      description: 'Pilote un vrai navigateur à travers plusieurs couches de l’application.',
      points: ['Confiance utilisateur', 'Routage et backend', 'Plus lent et plus fragile'],
      recommended: true,
    },
    {
      badge: 'Ciblé',
      title: 'Test unitaire',
      description: 'Vérifie rapidement une règle isolée sans parcourir toute l’application.',
      points: ['Diagnostic précis', 'Rapide', 'Ne valide pas l’intégration complète'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Un test end-to-end pilote l'application comme un utilisateur : il ouvre une page, remplit des champs, clique puis vérifie le résultat visible et l'URL.",
    why: "Des unités correctement testées peuvent malgré tout être mal reliées : mauvaise route, bouton inaccessible ou API non intégrée. L'E2E vérifie qu'un parcours critique fonctionne de bout en bout.",
    steps: [
      "Le runner démarre ou rejoint l'application de test.",
      "Un navigateur isolé ouvre l'URL initiale.",
      'Le test localise les éléments par leur rôle ou leur libellé accessible.',
      'Il effectue les actions du scénario.',
      "Les assertions vérifient le résultat observable par l'utilisateur.",
    ],
    demoGuide: [
      'Avance étape par étape dans le scénario de connexion.',
      'Chaque étape devient réussie avant de passer à la suivante.',
      "La dernière vérifie l'URL et le titre du dashboard.",
      'La simulation explique le scénario ; seul un runner comme Playwright exécute réellement un navigateur.',
    ],
    useCases: [
      {
        title: 'Parcours critique',
        description: 'Connexion, achat, facturation ou création d’une ressource.',
      },
      {
        title: 'Smoke test',
        description: 'Vérifier rapidement que les pages essentielles restent accessibles.',
      },
    ],
    mistakes: [
      'Tester chaque détail uniquement en E2E et créer une suite lente.',
      'Utiliser des sélecteurs CSS fragiles liés à la mise en page.',
      'Partager des données entre tests et rendre leur ordre obligatoire.',
    ],
    takeaway:
      "Réserve l'E2E à quelques parcours critiques et localise les éléments comme le ferait un utilisateur, par rôle ou libellé.",
    exercises: [
      "Ajoute un scénario d'identifiants invalides.",
      'Intercepte une API pour stabiliser une donnée externe.',
      "Exécute le test avec plusieurs tailles d'écran.",
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "page.goto('/login')",
      explanation: 'Demande au navigateur d’ouvrir la page de connexion.',
    },
    {
      code: "getByLabel('Email')",
      explanation: 'Trouve le champ grâce à son libellé accessible plutôt qu’à une classe CSS.',
    },
    { code: 'fill(...)', explanation: 'Remplace la valeur du champ comme une saisie utilisateur.' },
    {
      code: "getByRole('button', ...)",
      explanation: 'Localise le bouton selon son rôle et son nom visible.',
    },
    {
      code: 'expect(page).toHaveURL(...)',
      explanation: 'Attend puis vérifie le résultat observable de la navigation.',
    },
  ];
  next(): void {
    this.currentStep.update((step) => Math.min(this.steps.length, step + 1));
  }
  isCompleted(index: number): boolean {
    return index < this.currentStep();
  }
}
