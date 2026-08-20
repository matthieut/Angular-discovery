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
  selector: 'app-routing-concept',
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
  templateUrl: './routing.html',
  styleUrl: './routing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly url = signal('/projects/42');
  readonly match = computed(() => {
    const value = this.url();
    if (value === '/home') return { route: 'home', component: 'HomePage', params: '—' };
    const project = value.match(/^\/projects\/(\d+)$/);
    if (project)
      return { route: 'projects/:id', component: 'ProjectPage', params: `id = ${project[1]}` };
    return { route: '**', component: 'NotFoundPage', params: '—' };
  });
  readonly code = `export const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'projects/:id', component: ProjectPage },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: NotFoundPage }
];`;
  readonly paramsCode = `readonly route = inject(ActivatedRoute);
readonly projectId = toSignal(
  this.route.paramMap.pipe(map(params => params.get('id')))
);`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Déclaratif',
      title: 'RouterLink',
      description: 'Angular construit l’URL et gère la navigation depuis le template.',
      points: ['Accessible', 'Préchargement possible', 'Évite les URLs concaténées'],
      recommended: true,
    },
    {
      badge: 'Impératif',
      title: 'router.navigate',
      description: 'Le code déclenche la navigation après une décision ou une action.',
      points: ['Après sauvegarde', 'Segments et queryParams', 'À éviter pour un simple lien'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'Le routeur associe une URL à un composant. Il permet de changer de page sans recharger tout le document HTML et conserve une URL partageable pour chaque état de navigation important.',
    why: "Sans routeur, une application monopage devrait gérer elle-même l'historique du navigateur, les paramètres d'URL et le composant à afficher.",
    steps: [
      "Le navigateur fournit l'URL courante.",
      "Angular compare ses segments aux routes dans l'ordre du tableau.",
      'La première route compatible est sélectionnée.',
      'Le composant correspondant est créé dans router-outlet.',
      'Les paramètres comme :id sont accessibles avec ActivatedRoute.',
    ],
    demoGuide: [
      'Teste /home : la route statique est sélectionnée.',
      'Teste /projects/42 : 42 devient le paramètre id.',
      'Teste une URL inconnue : la route ** affiche la page 404.',
      "L'ordre compte : ** doit rester en dernier car elle accepte tout.",
    ],
    useCases: [
      {
        title: 'Pages partageables',
        description: 'Portfolio, détail d’un projet ou écran métier.',
      },
      { title: 'Paramètres', description: 'Identifier une ressource avec /projects/:id.' },
    ],
    mistakes: [
      'Placer la route ** avant les routes précises.',
      "Utiliser un lien <a href> interne et recharger toute l'application.",
      "Mettre un état temporaire sensible dans l'URL.",
    ],
    takeaway:
      "Les routes sont testées dans l'ordre et leur composant s'affiche dans le router-outlet le plus proche.",
    exercises: [
      'Ajoute une route settings.',
      'Ajoute un queryParam tab.',
      'Crée une route enfant sous projects/:id.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "path: 'projects/:id'",
      explanation: ':id est un segment dynamique capturé depuis l’URL.',
    },
    {
      code: "pathMatch: 'full'",
      explanation: 'La redirection vide ne s’applique que si toute l’URL restante est vide.',
    },
    {
      code: "path: '**'",
      explanation: 'Capture toute URL qui n’a correspondu à aucune route précédente.',
    },
    {
      code: 'ActivatedRoute',
      explanation:
        'Expose les paramètres, query params et données de la route actuellement activée.',
    },
    {
      code: '<router-outlet />',
      explanation: 'Emplacement dans lequel Angular insère le composant de la route enfant active.',
    },
  ];
}
