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
  selector: 'app-feature-organization-concept',
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
  templateUrl: './feature-organization.html',
  styleUrl: './feature-organization.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureOrganizationConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly selected = signal('projects/pages/project-list.page.ts');
  readonly code = `src/app/
├── core/                 # Infrastructure globale
│   ├── auth/
│   └── http/
├── shared/               # UI réellement réutilisable
└── features/
    └── projects/
        ├── data-access/  # API et store de la feature
        ├── ui/           # Composants de présentation
        ├── pages/        # Composants routés
        └── projects.routes.ts`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Métier',
      title: 'Organisation par feature',
      description: 'Les fichiers qui évoluent ensemble restent proches.',
      points: ['Frontières visibles', 'Suppression facilitée', 'Lazy loading naturel'],
      recommended: true,
    },
    {
      badge: 'Technique',
      title: 'Organisation par type',
      description: 'Tous les composants, services et modèles sont regroupés séparément.',
      points: ['Simple au début', 'Navigation transversale', 'Se dégrade avec la taille'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'Organiser par features consiste à regrouper les pages, composants, services et modèles qui appartiennent au même domaine fonctionnel, par exemple projects ou billing.',
    why: 'Dans une grande application, un dossier global components et un dossier services obligent à parcourir tout le projet pour comprendre une seule fonctionnalité. La proximité des fichiers révèle leur dépendance réelle.',
    steps: [
      'Chaque feature représente un domaine ou un parcours utilisateur.',
      'pages contient les composants associés aux routes.',
      'ui contient les composants de présentation propres à la feature.',
      "data-access contient les appels API et l'état de cette feature.",
      'core et shared restent réservés aux éléments véritablement transversaux.',
    ],
    demoGuide: [
      "Clique sur un fichier de l'arborescence.",
      'Le chemin indique immédiatement son domaine et sa responsabilité.',
      'Une page peut utiliser ui et data-access de sa propre feature.',
      "Une feature ne devrait pas importer les détails internes d'une autre feature.",
    ],
    useCases: [
      { title: 'Projet évolutif', description: 'Plusieurs domaines métier ou équipes.' },
      {
        title: 'Lazy loading',
        description: 'Une feature correspond naturellement à une frontière de routes.',
      },
    ],
    mistakes: [
      'Transformer shared en dossier fourre-tout.',
      'Créer core, shared et data-access dans une application minuscule sans besoin réel.',
      'Autoriser des imports directs entre les détails internes de deux features.',
    ],
    takeaway:
      "Regroupe les fichiers qui changent pour la même raison ; n'organise pas seulement selon leur extension technique.",
    exercises: [
      'Réorganise une feature existante.',
      'Identifie les éléments faussement placés dans shared.',
      'Ajoute une règle ESLint de frontière entre features.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'features/projects/pages',
      explanation: 'Contient les composants routés qui composent les écrans de Projects.',
    },
    {
      code: 'features/projects/data-access',
      explanation: 'Isole les appels API et l’état liés au domaine Projects.',
    },
    {
      code: 'shared',
      explanation: 'Réservé aux composants utilisables sans dépendre d’un métier précis.',
    },
    {
      code: 'core',
      explanation:
        'Infrastructure créée une fois pour toute l’application, comme auth ou intercepteurs.',
    },
  ];
}
