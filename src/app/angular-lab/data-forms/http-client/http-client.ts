import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
type RequestState = 'idle' | 'loading' | 'success';
@Component({
  selector: 'app-http-client-concept',
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
  templateUrl: './http-client.html',
  styleUrl: './http-client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpClientConcept {
  private readonly destroyRef = inject(DestroyRef);
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly state = signal<RequestState>('idle');
  readonly users = signal<string[]>([]);
  readonly code = `@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}`;
  readonly usageCode = `readonly users = toSignal(this.userApi.getUsers(), { initialValue: [] });`;
  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Lecture',
      title: 'GET',
      description: 'Demande une ressource sans modifier le serveur.',
      points: ['Paramètres de requête', 'Réponse typée', 'Souvent idempotent'],
      recommended: true,
    },
    {
      badge: 'Modification',
      title: 'POST / PUT / DELETE',
      description: 'Créent, remplacent ou suppriment une ressource.',
      points: ['Corps de requête', 'Codes HTTP à traiter', 'Effets côté serveur'],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "HttpClient est le service Angular utilisé pour envoyer des requêtes HTTP à un serveur. Chaque méthode renvoie un Observable qui émet la réponse lorsque le serveur l'a fournie.",
    why: "Une application Web ne possède généralement pas toutes ses données dans le navigateur. HttpClient centralise les appels, le typage des réponses, les paramètres et l'intégration avec les intercepteurs.",
    steps: [
      'Le composant demande les données à un service métier.',
      'Le service appelle http.get, post, put ou delete.',
      "La requête part uniquement lorsqu'un consommateur s'abonne à l'Observable.",
      'La réponse est convertie selon le type attendu puis transmise au consommateur.',
      "Une erreur HTTP emprunte le canal error de l'Observable.",
    ],
    demoGuide: [
      'Clique sur Charger les utilisateurs.',
      "L'état loading représente le temps entre l'envoi et la réponse.",
      "Après le délai simulé, l'état success affiche les données.",
      'Dans une vraie application, HttpClient produirait ces états via son Observable.',
    ],
    useCases: [
      { title: 'API REST', description: 'Lire ou modifier des ressources métier.' },
      {
        title: 'Téléchargement',
        description: 'Récupérer un fichier ou suivre la progression d’un transfert.',
      },
    ],
    mistakes: [
      "Appeler HttpClient directement dans tous les composants au lieu d'un service métier.",
      "Croire qu'un Observable HTTP s'exécute sans abonnement.",
      'Faire confiance au type TypeScript sans valider les données externes critiques.',
    ],
    takeaway:
      "Le composant exprime le besoin ; un service encapsule l'URL et la requête HttpClient.",
    exercises: [
      'Ajoute un paramètre de recherche avec HttpParams.',
      'Affiche un état vide distinct du chargement.',
      'Ajoute un type User à la réponse.',
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'inject(HttpClient)',
      explanation: 'Demande le client HTTP configuré dans les providers de l’application.',
    },
    {
      code: 'http.get<User[]>',
      explanation: 'Décrit une requête GET dont la réponse est attendue comme un tableau de User.',
    },
    { code: "'/api/users'", explanation: 'URL relative appelée par le navigateur.' },
    {
      code: 'Observable<User[]>',
      explanation:
        'La méthode ne contient pas encore les utilisateurs ; elle décrit leur arrivée future.',
    },
    {
      code: 'toSignal(..., { initialValue: [] })',
      explanation:
        'Souscrit au flux et expose sa dernière réponse sous forme de signal lisible dans le template.',
    },
  ];
  load(): void {
    this.state.set('loading');
    this.users.set([]);
    timer(700)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.users.set(['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']);
        this.state.set('success');
      });
  }
}
