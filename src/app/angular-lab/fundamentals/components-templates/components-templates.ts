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
  selector: 'app-components-templates',
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
  templateUrl: './components-templates.html',
  styleUrl: './components-templates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsTemplates {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly showDetails = signal(true);
  readonly technologies = ['Angular', 'TypeScript', 'SCSS'];
  readonly componentCode = `@Component({
  selector: 'app-profile-card',
  standalone: true,
  templateUrl: './profile-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCard {
  readonly name = input.required<string>();
  readonly showDetails = input(true);
}`;
  readonly templateCode = `<article class="profile-card">
  <h3>{{ name() }}</h3>
  @if (showDetails()) {
    <ul>
      @for (technology of technologies; track technology) {
        <li>{{ technology }}</li>
      }
    </ul>
  }
</article>`;
  readonly responsibilityCode = `@Component({
  selector: 'app-profile-page',
  imports: [ProfileCard],
  template: '<app-profile-card [profile]="profile()" />'
})
export class ProfilePage {
  private readonly api = inject(ProfileApi);
  readonly profile = toSignal(this.api.getCurrent());
}

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly http = inject(HttpClient);
  getCurrent() { return this.http.get<Profile>('/api/profile'); }
}`;
  readonly creationModesCode = `// Template
<app-profile-card />

// Route
{ path: 'profile', loadComponent: () => import('./profile-card') }

// Création dynamique
viewContainer.createComponent(ProfileCard);`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Par défaut',
      title: 'Template externe',
      description: 'Le HTML reste séparé du comportement du composant.',
      points: ['Lisible sur les vues riches', 'Outils HTML efficaces', 'Responsabilités visibles'],
      recommended: true,
    },
    {
      badge: 'Cas compact',
      title: 'Template inline',
      description: 'Le template vit dans le décorateur du composant.',
      points: ['Pratique pour quelques lignes', 'Fichier unique', 'Devient vite illisible'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Un composant est une partie autonome de l'interface : par exemple un bouton, une carte de profil ou une page. Sa classe TypeScript contient l'état et les actions ; son template HTML décrit ce que l'utilisateur voit.",
    why: "Découper l'interface évite qu'une seule classe gère toute l'application. Chaque composant peut être compris, testé, réutilisé et modifié sans connaître tous les autres.",
    steps: [
      'Angular rencontre le selector du composant dans un template.',
      'Une route ou ViewContainerRef peut également demander la création d’une instance.',
      'Il crée une instance de la classe TypeScript.',
      'Le template lit les propriétés ou signals de cette instance.',
      "Quand l'état change, Angular actualise les parties du DOM concernées.",
    ],
    demoGuide: [
      'La carte affichée représente le composant ProfileCard.',
      'Le bouton modifie le signal showDetails.',
      '@if ajoute ou retire la liste selon ce signal.',
      '@for crée un élément li pour chaque technologie et track permet de les identifier.',
    ],
    useCases: [
      {
        title: 'Élément réutilisable',
        description:
          'Créer une carte, un tableau, un champ ou une modale utilisable à plusieurs endroits.',
      },
      {
        title: 'Page métier',
        description: 'Composer une page avec plusieurs responsabilités plus petites.',
      },
    ],
    mistakes: [
      'Créer un composant uniquement pour déplacer quelques lignes sans responsabilité claire.',
      'Mettre des appels réseau ou des calculs complexes directement dans le template.',
      'Oublier track dans une boucle contenant des éléments qui évoluent.',
      'Mélanger affichage, accès HTTP et règles métier indépendantes dans le même composant.',
    ],
    takeaway:
      "La classe prépare l'état et répond aux actions ; le template décrit l'affichage de cet état.",
    exercises: [
      'Extrais la carte de profil dans son propre composant.',
      'Ajoute un état vide avec @empty.',
      'Passe le nom au composant grâce à input().',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: "selector: 'app-profile-card'",
      explanation:
        'Définit la balise HTML utilisée pour insérer ce composant dans un autre template.',
    },
    {
      code: 'standalone: true',
      explanation:
        "Indique que le composant déclare directement ses dépendances et n'a pas besoin d'être déclaré dans un NgModule.",
    },
    {
      code: 'input.required<string>()',
      explanation:
        'Déclare une donnée obligatoire fournie par le composant parent et accessible comme un signal.',
    },
    {
      code: '@if (showDetails())',
      explanation: 'Ajoute le bloc au DOM uniquement lorsque le signal renvoie true.',
    },
    {
      code: '@for (...; track technology)',
      explanation:
        'Répète le bloc pour chaque technologie et aide Angular à réutiliser les bons éléments DOM.',
    },
  ];
}
