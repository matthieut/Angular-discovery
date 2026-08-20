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
type ErrorKind = 'network' | 'unauthorized' | 'server';
@Component({
  selector: 'app-error-handling-concept',
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
  templateUrl: './error-handling.html',
  styleUrl: './error-handling.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHandlingConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly kind = signal<ErrorKind>('network');
  readonly attempts = signal(0);
  readonly message = () =>
    ({
      network: 'Connexion impossible. Vérifie le réseau puis réessaie.',
      unauthorized: 'Ta session a expiré. Reconnecte-toi.',
      server: 'Le service rencontre un problème. Réessaie plus tard.',
    })[this.kind()];
  readonly code = `getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    retry({ count: 2, delay: 500 }),
    catchError(error => {
      const failure = mapHttpError(error);
      return throwError(() => failure);
    })
  );
}`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Local',
      title: 'Erreur attendue',
      description: 'Le composant peut proposer une action adaptée à son contexte.',
      points: ['Message métier', 'Bouton Réessayer', 'État vide spécifique'],
      recommended: true,
    },
    {
      badge: 'Global',
      title: 'Erreur transversale',
      description: 'Un intercepteur traite une préoccupation commune à toutes les requêtes.',
      points: ['Authentification', 'Journalisation', 'Ne pas masquer le contexte métier'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Une erreur est un résultat possible d'une opération asynchrone. La gérer consiste à la classifier, conserver un état cohérent et proposer une action compréhensible au lieu d'afficher l'erreur technique brute.",
    why: "Un réseau peut être coupé, une session expirer ou un serveur échouer. Sans stratégie, l'interface reste bloquée en chargement ou expose un message inutile comme HttpErrorResponse 0.",
    steps: [
      "L'Observable HTTP émet une erreur.",
      'catchError intercepte cette erreur dans le pipeline.',
      "Le code transforme l'erreur technique en erreur applicative compréhensible.",
      'Le composant affiche un état adapté et éventuellement une action de reprise.',
      'Les détails techniques sont journalisés séparément.',
    ],
    demoGuide: [
      "Choisis un type d'échec.",
      'Observe que chaque erreur produit un message et une action différents.',
      'Réessayer incrémente le nombre de tentatives sans prétendre que toutes les erreurs sont récupérables.',
      "Une expiration de session devrait plutôt déclencher une reconnexion qu'une boucle de retry.",
    ],
    useCases: [
      { title: 'Erreur récupérable', description: 'Coupure temporaire : proposer Réessayer.' },
      {
        title: 'Erreur d’autorisation',
        description: 'Rediriger ou demander une nouvelle connexion.',
      },
      {
        title: 'Erreur métier',
        description: 'Afficher la règle refusée près de l’action concernée.',
      },
    ],
    mistakes: [
      'Relancer automatiquement toutes les erreurs, y compris les erreurs 400.',
      "Afficher error.message directement à l'utilisateur.",
      'Intercepter globalement une erreur puis la masquer au composant.',
    ],
    takeaway:
      "Une bonne gestion d'erreur répond à trois questions : que s'est-il passé, que reste-t-il affichable et que peut faire l'utilisateur ?",
    exercises: [
      'Mappe les statuts 401, 404 et 500.',
      'Ajoute un retry uniquement pour une erreur réseau.',
      'Crée un modèle Failure indépendant de HttpErrorResponse.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'retry({ count: 2 })',
      explanation: 'Réabonne le flux au maximum deux fois ; à réserver aux erreurs temporaires.',
    },
    {
      code: 'catchError(error => ...)',
      explanation:
        'Intercepte le canal d’erreur et permet de le transformer ou de fournir une valeur de secours.',
    },
    {
      code: 'mapHttpError(error)',
      explanation:
        'Isole la traduction d’une erreur technique vers un modèle compris par l’application.',
    },
    {
      code: 'throwError(() => failure)',
      explanation:
        'Renvoie une nouvelle erreur afin que le composant sache que l’opération a échoué.',
    },
  ];
}
