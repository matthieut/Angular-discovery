import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { timer } from 'rxjs';
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
  selector: 'app-lazy-loading-concept',
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
  templateUrl: './lazy-loading.html',
  styleUrl: './lazy-loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadingConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly loaded = signal(new Set(['shell']));
  readonly loading = signal('');
  readonly code = `{
  path: 'admin',
  loadComponent: () =>
    import('./admin/admin.page').then(m => m.AdminPage)
}`;
  readonly routesCode = `{
  path: 'catalogue',
  loadChildren: () =>
    import('./catalogue/catalogue.routes').then(m => m.CATALOGUE_ROUTES)
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Composant',
      title: 'loadComponent',
      description: 'Charge un composant de page uniquement lorsque sa route est visitée.',
      points: ['Route simple', 'Chunk dédié', 'API standalone'],
      recommended: true,
    },
    {
      badge: 'Sous-arbre',
      title: 'loadChildren',
      description: 'Charge un ensemble de routes et leurs composants.',
      points: ['Feature complète', 'Routes enfants', 'Frontière d’architecture'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Le lazy loading reporte le téléchargement du code d'une page jusqu'au moment où l'utilisateur ouvre sa route. Le build place ce code dans un fichier séparé appelé chunk.",
    why: "Télécharger toute l'application au premier affichage ralentit inutilement l'utilisateur, surtout s'il n'ouvre jamais les écrans d'administration ou certaines fonctionnalités.",
    steps: [
      'La route utilise loadComponent ou loadChildren avec import().',
      'Le build détecte cet import dynamique et crée un chunk séparé.',
      'Au premier accès à la route, le navigateur télécharge ce chunk.',
      "Angular charge le composant puis l'affiche dans router-outlet.",
      'Les accès suivants réutilisent généralement le fichier déjà en cache.',
    ],
    demoGuide: [
      'Le shell est déjà chargé : il correspond au code initial.',
      'Clique sur une feature : son état passe temporairement à Chargement.',
      'Après le délai simulé, son chunk devient chargé.',
      'Clique à nouveau : le code est déjà présent et ne nécessite pas de nouveau chargement.',
    ],
    useCases: [
      {
        title: 'Feature rarement visitée',
        description: 'Administration, reporting ou configuration.',
      },
      {
        title: 'Application volumineuse',
        description: 'Découper le bundle selon les parcours utilisateur.',
      },
    ],
    mistakes: [
      'Créer des dizaines de minuscules chunks sans mesurer le coût réseau.',
      'Importer ailleurs statiquement le même composant et annuler le lazy loading.',
      'Confondre lazy loading et chargement différé des données métier.',
    ],
    takeaway:
      'Le lazy loading retarde le code ; HttpClient charge les données. Ce sont deux optimisations différentes.',
    exercises: [
      'Convertis une route component en loadComponent.',
      'Observe les chunks produits par ng build.',
      'Ajoute un preloadingStrategy et compare.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'loadComponent: () => import(...)',
      explanation:
        'Retourne une Promise d’import dynamique exécutée lorsque la route devient active.',
    },
    {
      code: '.then(m => m.AdminPage)',
      explanation: 'Sélectionne le composant exporté par le fichier téléchargé.',
    },
    {
      code: 'loadChildren',
      explanation: 'Charge une configuration de routes complète plutôt qu’un seul composant.',
    },
    {
      code: 'chunk',
      explanation: 'Fichier JavaScript séparé généré par le build et récupéré à la demande.',
    },
  ];
  load(feature: string): void {
    if (this.loaded().has(feature) || this.loading()) return;
    this.loading.set(feature);
    timer(600).subscribe(() => {
      this.loaded.update((items) => new Set([...items, feature]));
      this.loading.set('');
    });
  }
}
