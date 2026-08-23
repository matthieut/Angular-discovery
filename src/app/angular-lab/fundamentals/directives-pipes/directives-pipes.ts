import { UpperCasePipe } from '@angular/common';
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
import { HighlightDirective } from './highlight.directive';
import { InitialsPipe } from './initials.pipe';

@Component({
  selector: 'app-directives-pipes',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    HighlightDirective,
    InitialsPipe,
    CodePreview,
    CodeWalkthrough,
    ConceptComparison,
    ConceptHeader,
    ConceptLearning,
    ConceptPagination,
    ConceptTabs,
    DemoHeader,
  ],
  templateUrl: './directives-pipes.html',
  styleUrl: './directives-pipes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesPipes {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly query = signal('');
  readonly highlight = signal(true);
  readonly members = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  readonly visibleMembers = computed(() =>
    this.members.filter((member) => member.toLowerCase().includes(this.query().toLowerCase())),
  );
  readonly templateCode = `@for (member of visibleMembers(); track member) {
  <article [appHighlight]="highlight()">
    <span>{{ member | initials }}</span>
    <strong>{{ member | uppercase }}</strong>
  </article>
} @empty {
  <p>Aucun résultat</p>
}`;
  readonly pipeCode = `@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    return value.split(/\\s+/).map(part => part[0]).join('').slice(0, 2);
  }
}`;
  readonly pureImpureCode = `// Pipe pur : valeur par défaut
@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe { /* recalcul si une entrée change */ }

// Pipe impur : à réserver aux cas exceptionnels
@Pipe({ name: 'filterUsers', standalone: true, pure: false })
export class FilterUsersPipe implements PipeTransform {
  transform(users: User[], query: string): User[] {
    return users.filter(user => user.name.includes(query));
  }
}`;
  readonly directiveKindsCode = `// Directive d’attribut : modifie un élément existant
<article [appHighlight]="selected()"></article>

// Contrôle de flux structurel : crée ou retire des vues
@if (selected()) { <article>Détail</article> }
@for (user of users(); track user.id) { <user-card [user]="user" /> }`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Transformation',
      title: 'Pipe pur',
      description: 'Transforme une valeur sans modifier sa source.',
      points: ['Mémorisable par Angular', 'Déterministe', 'Idéal pour la présentation'],
      recommended: true,
    },
    {
      badge: 'Comportement DOM',
      title: 'Directive attribut',
      description: 'Ajoute un comportement à un élément existant.',
      points: ['Réutilisable', 'Pas de nouveau DOM', 'Entrées configurables'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      'Une directive ajoute un comportement à un élément HTML existant. Un pipe transforme une valeur uniquement pour son affichage, sans modifier la valeur originale dans la classe TypeScript.',
    why: "Certaines règles d'affichage ou de comportement se répètent dans plusieurs composants. Les directives et les pipes permettent de les écrire une seule fois puis de les réutiliser dans les templates.",
    steps: [
      'Angular repère le nom de la directive ou du pipe dans le template.',
      "Il fournit la valeur d'entrée au code réutilisable.",
      "La directive agit sur l'élément, tandis que le pipe renvoie une valeur d'affichage.",
      'Une directive d’attribut modifie un élément existant ; un contrôle structurel crée ou retire des vues.',
      'Un pipe pur est recalculé lorsque ses entrées changent ; pure: false autorise des exécutions beaucoup plus fréquentes.',
      "Lorsque l'entrée change, Angular réévalue ce qui doit l'être.",
    ],
    demoGuide: [
      'Le champ de recherche modifie query et visibleMembers filtre la liste.',
      'Le pipe initials transforme Ada Lovelace en AL sans modifier le nom original.',
      'Le pipe uppercase produit le nom en majuscules.',
      'Le bouton active appHighlight, qui change la bordure de chaque carte.',
    ],
    useCases: [
      { title: 'Formatage', description: 'Présenter une date, un montant, un nom ou un libellé.' },
      {
        title: 'Comportement transversal',
        description:
          'Partager une règle de focus, de permission, de surbrillance ou d’observation.',
      },
    ],
    mistakes: [
      'Mettre une transformation métier ou un appel HTTP dans un pipe.',
      'Utiliser une directive pour recréer un composant qui devrait avoir son propre template.',
      "Créer un pipe impur pour contourner une mauvaise gestion de l'état.",
      'Utiliser pure: false sur un filtrage coûteux sans mesurer sa fréquence d’exécution.',
    ],
    takeaway:
      "Le pipe transforme une valeur d'affichage ; la directive enrichit le comportement d'un élément du DOM.",
    exercises: [
      'Ajoute un pipe de troncature.',
      'Rends la couleur de HighlightDirective configurable.',
      'Affiche un état vide avec @empty.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'member | initials',
      explanation: 'Envoie member dans InitialsPipe et affiche la chaîne renvoyée par transform.',
    },
    {
      code: '[appHighlight]="highlight()"',
      explanation: "Applique la directive à l'article et lui transmet un booléen.",
    },
    {
      code: 'pure: true',
      explanation:
        "Angular ne relance le pipe que lorsque la référence de sa valeur d'entrée change.",
    },
    {
      code: 'transform(value: string)',
      explanation: 'Méthode appelée par Angular pour produire la valeur qui sera affichée.',
    },
    {
      code: '@empty',
      explanation: 'Bloc affiché par @for lorsque la collection ne contient aucun élément.',
    },
  ];
}
