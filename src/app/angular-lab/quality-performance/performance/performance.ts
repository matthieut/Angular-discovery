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
  selector: 'app-performance-concept',
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
  templateUrl: './performance.html',
  styleUrl: './performance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly size = signal(100);
  readonly tracked = signal(true);
  readonly visibleItems = computed(() =>
    Array.from({ length: Math.min(this.size(), 30) }, (_, id) => ({
      id,
      label: `Élément ${id + 1}`,
    })),
  );
  readonly estimatedOps = computed(() => (this.tracked() ? Math.min(this.size(), 5) : this.size()));
  readonly code = `@for (item of items(); track item.id) {
  <app-result-row [item]="item" />
}

readonly filteredItems = computed(() =>
  this.items().filter(item => item.visible)
);`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Mesuré',
      title: 'Optimisation ciblée',
      description: 'Le profiler identifie un coût réel puis une modification vérifie son impact.',
      points: ['Mesure avant/après', 'Traite le goulot', 'Conserve la lisibilité'],
      recommended: true,
    },
    {
      badge: 'Supposé',
      title: 'Optimisation prématurée',
      description: 'Complexifie le code sans preuve que cette zone ralentit l’utilisateur.',
      points: ['Maintenance accrue', 'Gain incertain', 'Peut déplacer le problème'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'La performance perçue dépend du temps de chargement, du travail JavaScript, du nombre de modifications DOM et de la fluidité des interactions. Optimiser consiste à mesurer un goulot puis réduire le travail inutile.',
    why: 'Une interface correcte peut devenir lente avec beaucoup de données, de calculs ou de composants. Mais optimiser sans mesure conduit souvent à complexifier la mauvaise partie.',
    steps: [
      'Mesure une interaction réelle avec les outils du navigateur et Angular DevTools.',
      'Identifie si le coût vient du réseau, du calcul, de la détection ou du DOM.',
      'Applique une modification ciblée : lazy loading, track, computed, virtualisation ou cache.',
      'Mesure à nouveau avec le même scénario.',
      "Conserve l'optimisation seulement si le gain est significatif.",
    ],
    demoGuide: [
      'Change la taille théorique de la liste.',
      'Sans track, la simulation estime que tous les nœuds peuvent être recréés.',
      'Avec track item.id, Angular peut associer les anciennes et nouvelles lignes.',
      'Seuls 30 éléments sont rendus dans la démo : pour des milliers, utilise une vraie virtualisation.',
    ],
    useCases: [
      {
        title: 'Liste importante',
        description: 'track et virtualisation pour limiter les opérations DOM.',
      },
      {
        title: 'Chargement initial',
        description: 'Lazy loading, compression et analyse du bundle.',
      },
      { title: 'Calcul dérivé', description: 'computed ou mémoïsation après mesure.' },
    ],
    mistakes: [
      "Déclarer une page performante uniquement parce qu'elle utilise OnPush.",
      'Utiliser track $index pour une liste réordonnable.',
      'Tester uniquement sur une machine de développement puissante.',
    ],
    takeaway:
      "Mesure d'abord. Réduis ensuite le réseau, le calcul ou le DOM responsable du ralentissement.",
    exercises: [
      'Profile une interaction avec Angular DevTools.',
      'Compare track item.id et track $index après réordonnancement.',
      'Teste une liste virtualisée.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'track item.id',
      explanation:
        'Donne une identité stable permettant de réutiliser le bon élément DOM après une modification.',
    },
    {
      code: 'computed(() => filter(...))',
      explanation: 'Mémorise le résultat jusqu’au changement d’une dépendance lue.',
    },
    {
      code: 'virtualisation',
      explanation: 'Ne crée dans le DOM que les lignes visibles à l’écran.',
    },
    {
      code: 'lazy loading',
      explanation: 'Retarde le téléchargement du code qui n’est pas nécessaire au premier écran.',
    },
  ];
}
