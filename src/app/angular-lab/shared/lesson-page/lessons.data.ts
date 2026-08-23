import { LessonPageDefinition } from './lesson-page.models';
import { REMAINING_LESSONS } from './remaining-lessons.data';

export const LAB_LESSONS: Record<string, LessonPageDefinition> = {
  ...REMAINING_LESSONS,
  'lifecycle-rendering': {
    id: 'lifecycle-rendering', category: 'Fondamentaux', sheetNumber: 6,
    title: 'Cycle de vie et rendu',
    description: 'Savoir quand Angular crée, affiche, met à jour puis détruit un composant, sans transformer les hooks en fourre-tout.',
    level: 'Fondamental', demoKind: 'lifecycle',
    demoTitle: 'Suivre la vie d’une fiche produit',
    demoDescription: 'Sélectionne une étape pour comprendre ce qui existe déjà à cet instant.',
    demoActions: ['Construction de la classe', 'Réception des inputs', 'Premier rendu du DOM', 'Modification de l’état', 'Destruction du composant'],
    demoResults: [
      'Angular crée l’instance et résout ses dépendances. Le DOM de ce composant n’existe pas encore : il est trop tôt pour lire un élément du template.',
      'Les valeurs venant du parent sont disponibles. ngOnChanges permet de comparer une ancienne et une nouvelle valeur ; ngOnInit sert à une initialisation unique.',
      'Angular a créé la vue. afterNextRender convient à une opération qui exige un DOM effectivement rendu, comme initialiser une bibliothèque graphique.',
      'Un signal ou un input change. Angular recalcule les expressions qui dépendent de cet état et met à jour uniquement les propriétés DOM concernées.',
      'La route ou une condition retire le composant. Angular libère la vue ; ngOnDestroy sert à nettoyer uniquement ce qui ne se nettoie pas automatiquement.',
    ],
    codeExamples: [
      { filename: 'product-card.ts', caption: 'Hooks essentiels et intention de chacun', code: `@Component({
  selector: 'app-product-card',
  template: \`<h2 #title>{{ product().name }}</h2>\`
})
export class ProductCard implements OnChanges, OnInit, OnDestroy {
  readonly product = input.required<Product>();

  constructor() {
    afterNextRender(() => console.log('DOM rendu'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) console.log('nouveau produit');
  }

  ngOnInit(): void { console.log('initialisation unique'); }
  ngOnDestroy(): void { console.log('nettoyage'); }
}` },
      { filename: 'clock.ts', caption: 'Nettoyage automatique avec DestroyRef', code: `export class Clock {
  private readonly destroyRef = inject(DestroyRef);
  readonly now = signal(new Date());

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}` },
      { filename: 'live-clock.ts', caption: 'Souscription RxJS liée à la destruction', code: `export class LiveClock {
  readonly now = signal(new Date());

  constructor() {
    interval(1000).pipe(
      takeUntilDestroyed()
    ).subscribe(() => this.now.set(new Date()));
  }
}` },
    ],
    walkthrough: [
      { code: 'input.required<Product>()', explanation: 'Déclare une donnée obligatoire fournie par le parent. Elle est disponible avant ngOnInit.' },
      { code: 'ngOnChanges(changes)', explanation: 'Réagit aux changements d’inputs. Utilise-le seulement si tu dois connaître la valeur précédente.' },
      { code: 'afterNextRender(...)', explanation: 'Exécute le callback après le prochain rendu réel du DOM, contrairement à ngOnInit.' },
      { code: 'destroyRef.onDestroy(...)', explanation: 'Rattache explicitement le nettoyage à la durée de vie de l’instance.' },
      { code: 'takeUntilDestroyed()', explanation: 'Complète automatiquement une souscription RxJS lorsque le composant est détruit.' },
      { code: 'ngAfterViewChecked', explanation: 'Est rappelé après de nombreuses vérifications de la vue : évite d’y placer un calcul ou une mutation répétitive.' },
    ],
    comparisons: [
      { badge: 'État', title: 'Réaction déclarative', description: 'computed et le template dérivent automatiquement une valeur.', points: ['Moins de hooks', 'Dépendances visibles', 'Choix par défaut'], recommended: true },
      { badge: 'Cycle', title: 'Hook de cycle de vie', description: 'Exécute un effet à une étape précise de création ou destruction.', points: ['Utile pour le DOM', 'Utile pour le nettoyage', 'À employer avec une raison temporelle'] },
    ],
    learning: {
      prerequisites: ['Savoir ce qu’est un composant et un template.', 'Savoir modifier un état avec un signal.'],
      mentalModel: 'Un composant n’est pas seulement une classe : Angular gère une instance, une vue associée et une durée de vie. Un hook est une notification envoyée à une étape précise de cette durée de vie.',
      definition: 'Le cycle de vie est la succession d’étapes traversées par un composant : création, réception des données, rendu, mises à jour et destruction. Les hooks sont des méthodes permettant d’exécuter du code à certaines de ces étapes.',
      why: 'Certaines opérations ne sont valides qu’à un moment précis. Lire le DOM avant qu’il existe échoue ; conserver un timer après la disparition du composant gaspille des ressources. Les hooks rendent ce moment explicite.',
      steps: ['Angular construit la classe et injecte ses dépendances.', 'Angular affecte les inputs venant du parent.', 'Angular évalue le template et crée la vue.', 'Quand l’état change, Angular met à jour les bindings concernés.', 'Quand la vue disparaît, Angular détruit le composant et déclenche le nettoyage.'],
      demoGuide: ['Commence par la construction : aucun élément HTML n’existe encore.', 'Compare réception des inputs et premier rendu : données et DOM ne deviennent pas disponibles au même moment.', 'Observe que modifier l’état ne recrée pas forcément le composant.', 'Termine par la destruction et identifie les ressources à libérer.'],
      useCases: [
        { title: 'Initialisation', description: 'ngOnInit pour lancer une préparation unique qui ne dépend pas du DOM.' },
        { title: 'DOM externe', description: 'afterNextRender pour initialiser un graphique ou mesurer un élément rendu.' },
        { title: 'Nettoyage', description: 'DestroyRef ou ngOnDestroy pour un timer, un listener manuel ou une API impérative.' },
      ],
      mistakes: ['Utiliser ngOnInit pour lire un élément du template.', 'Mettre toute la logique métier dans les hooks.', 'S’abonner manuellement sans takeUntilDestroyed, AsyncPipe ou autre stratégie de désinscription.', 'Effectuer un calcul coûteux dans ngAfterViewChecked ou ngDoCheck.'],
      takeaway: 'Choisis un hook uniquement lorsque ton code dépend réellement d’un moment du cycle de vie ; pour calculer une valeur, préfère computed.',
      exercises: ['Ajoute un timer et arrête-le à la destruction.', 'Journalise les changements d’un input productId.', 'Initialise une fausse bibliothèque après le rendu.'],
      exerciseSolutions: ['Conserve l’identifiant de setInterval puis appelle clearInterval avec DestroyRef.onDestroy.', 'Déclare productId avec input.required et lis changes["productId"] dans ngOnChanges.', 'Appelle la fonction d’initialisation dans afterNextRender, pas dans le constructeur directement.'],
    },
    current: 6, previousRoute: '../injection-dependances', nextRoute: '../http-intercepteurs',
  },

  'http-interceptors': {
    id: 'http-interceptors', category: 'Fondamentaux', sheetNumber: 7,
    title: 'HttpClient et intercepteurs',
    description: 'Comprendre le trajet complet d’une requête HTTP, son typage, ses états et les responsabilités d’un intercepteur.',
    level: 'Fondamental', demoKind: 'http',
    demoTitle: 'Du clic utilisateur jusqu’au serveur', demoDescription: 'Parcours le pipeline sans confondre requête, réponse et état d’interface.',
    demoActions: ['L’utilisateur déclenche le chargement', 'Le service construit la requête', 'Les intercepteurs la traversent', 'Le serveur répond', 'Le composant affiche le résultat'],
    demoResults: [
      'Le composant exprime une intention : charger les produits. Il ne connaît ni l’URL exacte ni la manière d’ajouter l’authentification.',
      'Le service de data access appelle HttpClient. Le type générique décrit la forme attendue, mais ne valide pas magiquement le JSON reçu.',
      'Chaque intercepteur peut cloner la requête pour ajouter un en-tête, puis transmettre au suivant avec next. La requête est immuable.',
      'HttpClient émet une réponse ou une erreur dans un Observable. Une requête classique se termine après cette émission.',
      'Le composant représente explicitement chargement, succès, vide ou erreur. Une liste vide n’est pas une erreur réseau.',
    ],
    codeExamples: [
      { filename: 'app.config.ts', caption: 'Activation de HttpClient et déclaration des intercepteurs', code: `export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorLoggingInterceptor])
    )
  ]
};` },
      { filename: 'products-api.ts', caption: 'Service HTTP et intercepteur fonctionnel', code: `@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>('/api/products');
  }
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).token();
  const authenticated = token
    ? request.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
    : request;
  return next(authenticated);
};` },
      { filename: 'http-errors.ts', caption: 'Traiter puis propager une erreur', code: `return this.http.get<ProductDto[]>('/api/products').pipe(
  catchError(error => {
    this.logger.error('Chargement impossible', error);
    return throwError(() => error);
  })
);

// Deux souscriptions indépendantes à un Observable HTTP froid
// déclenchent deux requêtes, sauf stratégie de partage explicite.` },
    ],
    walkthrough: [
      { code: 'provideHttpClient(...)', explanation: 'Enregistre HttpClient dans l’injecteur de l’application. Sans ce provider, inject(HttpClient) échoue.' },
      { code: 'withInterceptors([...])', explanation: 'Déclare explicitement l’ordre du pipeline. La requête traverse les intercepteurs dans cet ordre.' },
      { code: 'get<ProductDto[]>', explanation: 'Informe TypeScript du type attendu ; ce n’est pas une validation runtime du serveur.' },
      { code: 'request.clone(...)', explanation: 'Crée une nouvelle requête modifiée, car HttpRequest est immuable.' },
      { code: 'return next(authenticated)', explanation: 'Transmet la requête au maillon suivant et retourne le flux de réponse.' },
      { code: 'throwError(() => error)', explanation: 'Propage l’erreur après le traitement technique afin que le contexte appelant puisse décider de la réaction métier.' },
    ],
    comparisons: [
      { badge: 'Métier', title: 'Service de data access', description: 'Connaît les endpoints et transforme les DTO.', points: ['Responsabilité locale', 'API lisible', 'Facile à tester'], recommended: true },
      { badge: 'Transverse', title: 'Intercepteur', description: 'Traite une règle commune à de nombreuses requêtes.', points: ['Authentification', 'Journalisation', 'Gestion technique cohérente'] },
    ],
    learning: {
      prerequisites: ['Comprendre l’injection de dépendances.', 'Connaître la différence entre une valeur et un Observable.'],
      mentalModel: 'HttpClient est une fabrique de flux : aucune requête n’est envoyée tant que le flux n’est pas consommé. L’intercepteur est un middleware placé autour de toutes les requêtes sélectionnées.',
      definition: 'HttpClient est le service Angular qui envoie des requêtes HTTP et retourne des Observables. Un intercepteur est une fonction du pipeline capable d’examiner ou de cloner une requête et d’observer sa réponse.',
      why: 'Une application communique souvent avec plusieurs endpoints tout en répétant les mêmes besoins : jeton, en-têtes, logs ou traitement technique d’erreurs. Les services isolent chaque API ; les intercepteurs centralisent uniquement les règles transverses.',
      steps: ['Configurer HttpClient au bootstrap.', 'Créer un service qui expose une méthode métier explicite.', 'Consommer l’Observable dans le composant avec AsyncPipe, toSignal ou une souscription maîtrisée.', 'Déclarer les intercepteurs transverses dans un ordre volontaire.', 'Afficher séparément les états chargement, succès, vide et erreur.'],
      demoGuide: ['Lis la chaîne de gauche à droite.', 'À l’étape service, distingue type TypeScript et validation réelle.', 'À l’étape intercepteur, observe que la requête est clonée.', 'À la dernière étape, vérifie que l’interface modélise plusieurs états.'],
      useCases: [{ title: 'Lecture métier', description: 'Un service ProductsApi encapsule /api/products.' }, { title: 'Authentification', description: 'Un intercepteur ajoute le Bearer token aux requêtes concernées.' }, { title: 'Observabilité', description: 'Un intercepteur ajoute un identifiant de corrélation ou journalise la durée.' }],
      mistakes: ['Mettre tous les appels HTTP directement dans les composants.', 'Croire que le type générique valide le JSON.', 'Transformer toutes les erreurs en tableau vide.', 'Déclencher une seconde souscription involontaire et donc une seconde requête.', 'Ajouter le token à des domaines externes sans filtrer l’URL.'],
      takeaway: 'Le service porte le vocabulaire métier ; l’intercepteur porte une règle technique réellement transverse.',
      exercises: ['Déclare HttpClient et un intercepteur dans app.config.ts.', 'Ajoute un endpoint getById.', 'Filtre l’intercepteur pour ton domaine API.'],
      exerciseSolutions: ['Utilise provideHttpClient(withInterceptors([authInterceptor])).', 'Retourne this.http.get<ProductDto>(`/api/products/${id}`).', 'Teste request.url.startsWith(environment.apiUrl) avant d’ajouter Authorization.'],
    },
    current: 7, previousRoute: '../cycle-vie-rendu', nextRoute: '../../composants/anatomie-responsabilite',
  },

  'component-responsibility': {
    id: 'component-responsibility', category: 'Composants', sheetNumber: 8,
    title: 'Anatomie et responsabilité', description: 'Découper une interface en composants cohérents sans créer une poussière de fichiers ni un composant monolithique.',
    level: 'Fondamental', demoKind: 'responsibility', demoTitle: 'Découper une carte produit', demoDescription: 'Chaque étape attribue une responsabilité à la bonne couche.',
    demoActions: ['Décrire le besoin utilisateur', 'Identifier l’état affiché', 'Définir l’API du composant', 'Déléguer l’accès aux données', 'Vérifier la cohésion'],
    demoResults: ['Le besoin est « consulter un produit et l’ajouter au panier », pas « créer trois div et un bouton ». On part du comportement observable.', 'La carte reçoit un Product et expose une intention add. Elle ne possède pas toute la liste ni l’utilisateur courant.', 'Les inputs décrivent ce qui entre ; les outputs décrivent ce qui sort. Le parent reste propriétaire du scénario.', 'Le composant de présentation ne connaît ni HttpClient ni l’URL. Une façade ou un conteneur orchestre les données.', 'Le composant change pour une seule famille de raisons. Si prix, authentification et navigation évoluent indépendamment, le découpage est mauvais.'],
    codeExamples: [
      { filename: 'product-card.ts', caption: 'Un composant avec une responsabilité claire', code: `@Component({
  selector: 'app-product-card',
  template: \`
    <article>
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency:'EUR' }}</p>
      <button (click)="add.emit(product().id)">Ajouter</button>
    </article>
  \`,
  imports: [CurrencyPipe]
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly add = output<number>();
}` },
      { filename: 'catalog-page.ts', caption: 'Le parent orchestre le cas d’usage', code: `export class CatalogPage {
  private readonly catalog = inject(CatalogFacade);
  readonly products = this.catalog.products;

  addToCart(productId: number): void {
    this.catalog.addToCart(productId);
  }
}` },
    ],
    walkthrough: [{ code: 'input.required<Product>()', explanation: 'Rend le contrat entrant explicite et typé.' }, { code: 'output<number>()', explanation: 'Expose une intention métier sans décider ce que le parent doit en faire.' }, { code: 'inject(CatalogFacade)', explanation: 'Place l’orchestration dans le composant page, pas dans chaque carte.' }],
    comparisons: [{ badge: 'Cohérent', title: 'Composant orienté responsabilité', description: 'Son API raconte un élément d’interface ou un cas d’usage précis.', points: ['Test ciblé', 'Réutilisation honnête', 'Évolution localisée'], recommended: true }, { badge: 'Fragile', title: 'God component', description: 'Charge, transforme, affiche, navigue et gère toutes les erreurs.', points: ['Dépendances nombreuses', 'Tests lourds', 'Modifications risquées'] }],
    learning: {
      prerequisites: ['Connaître composant, template, input et output.'], mentalModel: 'Un composant est une frontière : il reçoit un petit contrat, gère éventuellement un état local, rend une vue et émet des intentions. Ce n’est ni une simple balise HTML ni automatiquement une couche métier.',
      definition: 'Un composant Angular associe une classe, un template et des styles à une balise personnalisée. Sa responsabilité est la raison cohérente pour laquelle ces éléments doivent évoluer ensemble.',
      why: 'Sans frontières, une page accumule accès réseau, règles métier et détails visuels. À l’inverse, extraire chaque ligne HTML crée une architecture illisible. La bonne granularité suit les comportements et les changements.',
      steps: ['Nommer le besoin visible par l’utilisateur.', 'Lister les données strictement nécessaires.', 'Lister les intentions émises vers le parent.', 'Conserver localement uniquement l’état d’interface.', 'Extraire une sous-partie si elle possède son propre contrat ou évolue indépendamment.'],
      demoGuide: ['Ne commence pas par compter les lignes.', 'Observe la différence entre donnée reçue et donnée chargée.', 'Vérifie que le nom du composant exprime son rôle.', 'Teste la règle : une responsabilité cohérente, pas forcément une seule méthode.'],
      useCases: [{ title: 'Élément réutilisable', description: 'Carte, tableau, sélecteur ou panneau possédant une API claire.' }, { title: 'Page conteneur', description: 'Orchestration d’un cas d’usage et composition de vues.' }],
      mistakes: ['Extraire un composant uniquement parce que le HTML est long.', 'Injecter tous les services dans chaque composant enfant.', 'Créer un composant générique avec vingt inputs.', 'Confondre responsabilité unique et taille minimale.'],
      takeaway: 'Découpe selon les responsabilités et les contrats, pas selon un nombre arbitraire de lignes.',
      exercises: ['Découpe une page catalogue en page, filtre et carte.', 'Écris l’API de ProductCard avant son template.', 'Repère trois responsabilités dans un composant monolithique.'],
      exerciseSolutions: ['CatalogPage orchestre, CatalogFilters émet les critères, ProductCard présente un produit.', 'Entrée product ; sortie add(productId).', 'Cherche séparément chargement des données, état de formulaire et rendu de la liste.'],
    }, current: 8, previousRoute: '../../fondamentaux/http-intercepteurs', nextRoute: '../inputs-outputs-model',
  },

  'inputs-outputs-model': {
    id: 'inputs-outputs-model', category: 'Composants', sheetNumber: 9,
    title: 'Inputs, outputs et model', description: 'Faire communiquer parent et enfant avec un flux lisible, typé et contrôlé.', level: 'Fondamental', demoKind: 'communication',
    demoTitle: 'Piloter un sélecteur de quantité', demoDescription: 'Observe qui possède la valeur et dans quel sens circule chaque information.',
    demoActions: ['Le parent possède quantity', 'L’enfant reçoit input()', 'L’utilisateur clique', 'L’enfant émet output()', 'model() simplifie un vrai two-way binding'],
    demoResults: ['Par défaut, le parent est la source de vérité. Il décide de la valeur transmise et peut la calculer ou la valider.', 'L’enfant lit l’input sans le réassigner. Recevoir une donnée ne lui donne pas automatiquement le droit d’en devenir propriétaire.', 'Le clic est traité localement, mais l’enfant ne modifie pas silencieusement l’état du parent.', 'L’output transmet une intention et sa donnée utile. Le parent choisit la réaction : mettre à jour, refuser ou appeler une API.', 'model() fournit une entrée modifiable et l’événement de changement associé. Réserve-le aux composants qui représentent réellement une valeur éditable.'],
    codeExamples: [
      { filename: 'quantity-picker.ts', caption: 'API explicite avec input et output', code: `export class QuantityPicker {
  readonly quantity = input.required<number>();
  readonly quantityChange = output<number>();

  increment(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }
}` },
      { filename: 'volume-slider.ts', caption: 'model pour un contrôle de valeur', code: `export class VolumeSlider {
  readonly value = model(50);
}

// Parent : liaison bidirectionnelle volontaire
// <app-volume-slider [(value)]="volume" />` },
    ],
    walkthrough: [{ code: 'input.required<number>()', explanation: 'Le parent doit fournir la valeur ; l’enfant la lit comme un signal.' }, { code: 'output<number>()', explanation: 'Crée un événement Angular typé, sans propagation DOM implicite.' }, { code: 'quantityChange.emit(...)', explanation: 'Notifie le parent avec la nouvelle proposition de valeur.' }, { code: 'model(50)', explanation: 'Crée une entrée modifiable accompagnée automatiquement de valueChange.' }],
    comparisons: [{ badge: 'Explicite', title: 'input + output', description: 'Sépare clairement la donnée reçue et l’intention émise.', points: ['Flux visible', 'Noms métier possibles', 'Choix par défaut'], recommended: true }, { badge: 'Contrôle', title: 'model', description: 'Représente une valeur que le composant enfant est autorisé à modifier.', points: ['Syntaxe [(value)]', 'Idéal pour un champ', 'À éviter pour toute communication'] }],
    learning: {
      prerequisites: ['Comprendre parent, enfant et signal.'], mentalModel: 'Les données descendent du parent vers l’enfant ; les événements remontent. model ne supprime pas cette règle : il fournit simplement le couple input/output pour une même valeur.',
      definition: 'input reçoit une donnée du parent. output envoie un événement vers le parent. model représente une valeur reçue que l’enfant peut également modifier, ce qui active la syntaxe de liaison bidirectionnelle.',
      why: 'Un enfant qui modifie directement l’état de son parent crée un couplage caché. Une API explicite rend le flux prévisible, testable et compréhensible depuis le template du parent.',
      steps: ['Le parent conserve la source de vérité.', 'Il transmet une valeur avec un property binding.', 'L’enfant rend cette valeur et détecte une interaction.', 'Il émet une intention typée.', 'Le parent décide de la nouvelle valeur.'],
      demoGuide: ['Demande-toi toujours qui possède quantity.', 'Suis la valeur qui descend puis l’événement qui remonte.', 'Compare le couple input/output avec model.', 'N’utilise model que si l’enfant est un éditeur de valeur.'],
      useCases: [{ title: 'Affichage', description: 'input pour configurer une carte ou un tableau.' }, { title: 'Action', description: 'output pour sélectionner, supprimer ou confirmer.' }, { title: 'Contrôle', description: 'model pour un sélecteur, une pagination ou un composant de formulaire.' }],
      mistakes: ['Muter un objet reçu par input.', 'Nommer un output clicked au lieu d’exprimer une intention.', 'Utiliser model pour éviter de réfléchir au propriétaire de l’état.', 'Émettre l’objet DOM complet alors qu’un identifiant suffit.'],
      takeaway: 'Une bonne API de composant permet de comprendre le flux uniquement en lisant la balise du parent.',
      exercises: ['Crée un Rating avec value et valueChange.', 'Transforme-le ensuite avec model.', 'Ajoute un output resetRequested sans modifier directement le parent.'],
      exerciseSolutions: ['Déclare input.required<number>() et output<number>(), puis émets la note.', 'Remplace les deux membres par value = model.required<number>().', 'Déclare resetRequested = output<void>() et appelle emit() au clic.'],
    }, current: 9, previousRoute: '../anatomie-responsabilite', nextRoute: '../projection-contenu',
  },

  'content-projection': {
    id: 'content-projection', category: 'Composants', sheetNumber: 10,
    title: 'Projection de contenu', description: 'Créer des composants enveloppes flexibles avec ng-content sans multiplier les inputs de présentation.', level: 'Intermédiaire', demoKind: 'projection',
    demoTitle: 'Composer une carte sans figer son contenu', demoDescription: 'Le parent fournit le contenu ; l’enfant possède la structure visuelle.',
    demoActions: ['Le composant définit des zones', 'Le parent écrit son contenu', 'Angular associe les sélecteurs', 'Le contenu garde son contexte parent', 'La carte applique sa mise en page'],
    demoResults: ['AppCard définit header, corps et actions avec plusieurs ng-content. Il ne connaît pas le texte métier.', 'Le parent place du HTML, des composants ou des bindings entre les balises app-card.', 'select="[card-title]" dirige chaque nœud vers le bon emplacement. Le ng-content sans select recueille le contenu restant.', 'Les expressions projetées sont évaluées dans le contexte du parent, là où elles ont été écrites.', 'L’enfant contrôle bordure, espacements et ordre des zones sans réécrire le contenu fourni.'],
    codeExamples: [
      { filename: 'card.ts', caption: 'Composant enveloppe avec emplacements', code: `@Component({
  selector: 'app-card',
  template: \`
    <article class="card">
      <header><ng-content select="[card-title]" /></header>
      <div class="body"><ng-content /></div>
      <footer><ng-content select="[card-actions]" /></footer>
    </article>
  \`
})
export class Card {}` },
      { filename: 'products.html', caption: 'Contenu fourni par le parent', code: `<app-card>
  <h2 card-title>{{ product().name }}</h2>
  <p>{{ product().description }}</p>
  <div card-actions>
    <button (click)="buy(product().id)">Acheter</button>
  </div>
</app-card>` },
    ],
    walkthrough: [{ code: '<ng-content />', explanation: 'Projette le contenu qui ne correspond à aucun emplacement nommé.' }, { code: 'select="[card-title]"', explanation: 'Sélectionne les éléments portant l’attribut card-title.' }, { code: '{{ product().name }}', explanation: 'Est évalué par le parent, même s’il est affiché dans le template enfant.' }],
    comparisons: [{ badge: 'HTML libre', title: 'Projection', description: 'Le parent fournit une structure ou plusieurs composants.', points: ['Composition flexible', 'Contexte parent conservé', 'Idéal pour les wrappers'], recommended: true }, { badge: 'Valeur', title: 'Input', description: 'Le parent fournit une donnée que l’enfant choisit de rendre.', points: ['Contrat strict', 'Template maîtrisé par l’enfant', 'Idéal pour les données'] }],
    learning: {
      prerequisites: ['Savoir utiliser un composant enfant et des inputs.'], mentalModel: 'ng-content est un emplacement, pas une copie de template. Le parent écrit le contenu et en reste propriétaire ; l’enfant décide seulement où cet ensemble apparaît dans sa structure.',
      definition: 'La projection de contenu permet à un composant d’afficher du contenu fourni entre ses balises par son parent. Un sélecteur peut répartir ce contenu dans plusieurs emplacements.',
      why: 'Passer title, subtitle, icon, buttonLabel et vingt autres inputs transforme un simple conteneur visuel en API rigide. La projection laisse le parent composer le contenu tout en réutilisant la structure.',
      steps: ['L’enfant place un ou plusieurs ng-content.', 'Le parent écrit le contenu entre les balises.', 'Angular classe les nœuds selon les sélecteurs.', 'Le contenu est affiché aux emplacements prévus.', 'Les bindings continuent d’utiliser les données du parent.'],
      demoGuide: ['Sépare structure de carte et contenu métier.', 'Repère les deux emplacements nommés.', 'Observe le ng-content par défaut.', 'Vérifie où product est déclaré : dans le parent.'],
      useCases: [{ title: 'Conteneur visuel', description: 'Carte, panneau, modal ou layout.' }, { title: 'API de composition', description: 'Zones titre, contenu et actions personnalisables.' }],
      mistakes: ['Créer un input pour chaque morceau de HTML.', 'Croire que le contenu projeté accède automatiquement aux propriétés privées de l’enfant.', 'Utiliser des sélecteurs trop fragiles liés à la structure DOM.', 'Projeter quand un simple input typé serait plus clair.'],
      takeaway: 'Utilise un input pour transmettre une donnée ; utilise la projection pour transmettre une structure de contenu.',
      exercises: ['Crée une Alert avec une zone actions.', 'Ajoute un emplacement icon.', 'Explique pourquoi le contenu lit les données du parent.'],
      exerciseSolutions: ['Place ng-content par défaut puis ng-content select="[alert-actions]".', 'Ajoute ng-content select="[alert-icon]".', 'Le template projeté est compilé dans le contexte où il est déclaré : celui du parent.'],
    }, current: 10, previousRoute: '../inputs-outputs-model', nextRoute: '../queries-references',
  },

  'queries-references': {
    id: 'queries-references', category: 'Composants', sheetNumber: 11,
    title: 'Queries et références', description: 'Référencer un élément ou un composant enfant sans contourner le modèle déclaratif d’Angular.', level: 'Intermédiaire', demoKind: 'queries',
    demoTitle: 'Donner le focus à un champ', demoDescription: 'Distingue référence locale, viewChild et contentChild.',
    demoActions: ['Créer #searchInput', 'L’utiliser dans le template', 'Lire avec viewChild', 'Attendre le rendu', 'Distinguer contentChild'],
    demoResults: ['#searchInput crée une référence locale vers l’élément dans ce template. Elle n’est pas une chaîne ni un sélecteur CSS.', 'Le template peut appeler searchInput.focus() directement pour une interaction purement locale.', 'viewChild retourne un signal query mis à jour si l’élément apparaît ou disparaît avec une condition.', 'Avant le rendu, la query peut être undefined. Un effet ou afterNextRender doit respecter cette temporalité.', 'contentChild recherche dans le contenu projeté par le parent ; viewChild recherche dans la vue propre du composant.'],
    codeExamples: [
      { filename: 'search-box.ts', caption: 'Référence locale et query signalée', code: `@Component({
  template: \`
    <input #searchInput />
    <button (click)="focus()">Rechercher</button>
  \`
})
export class SearchBox {
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  focus(): void {
    this.searchInput()?.nativeElement.focus();
  }
}` },
      { filename: 'tabs.ts', caption: 'Lire un enfant projeté', code: `export class Tabs {
  readonly panels = contentChildren(TabPanel);
  readonly selected = signal(0);

  select(index: number): void {
    if (index < this.panels().length) this.selected.set(index);
  }
}` },
    ],
    walkthrough: [{ code: '#searchInput', explanation: 'Nomme un élément ou une instance de directive dans le template courant.' }, { code: 'viewChild<ElementRef<...>>', explanation: 'Recherche dans la vue créée par ce composant et renvoie un signal.' }, { code: 'this.searchInput()?.nativeElement.focus()', explanation: 'Accès impératif limité à une capacité DOM qui n’existe pas comme binding.' }, { code: 'contentChildren(TabPanel)', explanation: 'Recherche plusieurs instances projetées depuis le parent.' }],
    comparisons: [{ badge: 'Vue', title: 'viewChild', description: 'Recherche dans le template du composant.', points: ['Élément interne', 'Composant enfant', 'Query signalée'], recommended: true }, { badge: 'Projection', title: 'contentChild', description: 'Recherche dans le contenu fourni par le parent.', points: ['Composants projetés', 'API de composition', 'Cycle différent'] }],
    learning: {
      prerequisites: ['Comprendre le rendu et la projection de contenu.'], mentalModel: 'Une query est une vue dynamique sur les enfants actuellement présents. Elle peut changer quand @if ou @for modifie la vue ; ce n’est pas une recherche ponctuelle comme querySelector.',
      definition: 'Une référence de template nomme localement un élément ou une directive. viewChild/viewChildren lisent la vue du composant ; contentChild/contentChildren lisent son contenu projeté.',
      why: 'Les bindings couvrent la majorité des interactions, mais certaines capacités sont impératives : focus, mesure ou API publique d’un enfant. Les queries fournissent un accès intégré au cycle de rendu Angular.',
      steps: ['Nommer la cible ou cibler son type.', 'Choisir vue interne ou contenu projeté.', 'Lire la query comme un signal.', 'Gérer l’absence éventuelle de la cible.', 'Limiter l’appel impératif à une action précise.'],
      demoGuide: ['Commence par la solution template la plus simple.', 'Ajoute viewChild seulement si le TypeScript doit agir.', 'Observe le ? qui gère l’absence.', 'Compare ensuite avec contentChildren.'],
      useCases: [{ title: 'Focus', description: 'Placer le curseur dans un champ après une action.' }, { title: 'API enfant', description: 'Appeler une méthode publique ciblée d’un composant enfant.' }, { title: 'Composition', description: 'Découvrir des panneaux projetés dans des tabs.' }],
      mistakes: ['Utiliser ElementRef pour modifier des styles qu’un binding peut gérer.', 'Supposer qu’une query optionnelle existe avant le rendu.', 'Coupler un parent à tous les détails internes de ses enfants.', 'Utiliser document.querySelector globalement.'],
      takeaway: 'Préserve le déclaratif ; utilise une query uniquement pour une capacité réellement impérative ou une API de composition.',
      exercises: ['Focalise un champ au clic.', 'Masque le champ avec @if et gère son absence.', 'Crée Tabs qui compte ses TabPanel projetés.'],
      exerciseSolutions: ['Déclare #input puis viewChild et appelle nativeElement.focus().', 'Utilise l’appel optionnel this.input()?.nativeElement.focus().', 'Déclare panels = contentChildren(TabPanel) puis lis panels().length.'],
    }, current: 11, previousRoute: '../projection-contenu', nextRoute: '../host-comportements',
  },

  'host-behaviors': {
    id: 'host-behaviors', category: 'Composants', sheetNumber: 12,
    title: 'Host bindings et comportements', description: 'Faire porter au composant ou à une directive son état, ses attributs et ses interactions de surface.', level: 'Intermédiaire', demoKind: 'host',
    demoTitle: 'Une directive de bouton désactivable', demoDescription: 'Le host est l’élément qui porte la directive ou la balise du composant.',
    demoActions: ['Appliquer la directive', 'Lire un input disabled', 'Lier aria-disabled', 'Intercepter le clic', 'Réutiliser le comportement'],
    demoResults: ['La directive est attachée à un bouton existant : ce bouton devient son élément host.', 'L’input décrit l’état public de la directive. Il reste contrôlé par le composant parent.', 'La configuration host reflète l’état dans une classe et un attribut accessible.', 'Le listener du host bloque seulement l’interaction quand disabled vaut true.', 'Le comportement peut être réutilisé sur plusieurs boutons sans dupliquer handlers et attributs.'],
    codeExamples: [
      { filename: 'disable-while-loading.directive.ts', caption: 'Comportement réutilisable porté par le host', code: `@Directive({
  selector: '[appDisableWhileLoading]',
  host: {
    '[class.is-loading]': 'loading()',
    '[attr.aria-disabled]': 'loading()',
    '[disabled]': 'loading()',
  }
})
export class DisableWhileLoading {
  readonly loading = input(false, { alias: 'appDisableWhileLoading' });
}` },
      { filename: 'save-button.html', caption: 'Utilisation sur un élément natif', code: `<button
  type="button"
  [appDisableWhileLoading]="saving()"
  (click)="save()"
>
  {{ saving() ? 'Enregistrement…' : 'Enregistrer' }}
</button>` },
    ],
    walkthrough: [{ code: "selector: '[appDisableWhileLoading]'", explanation: 'La directive s’active lorsqu’un élément porte cet attribut.' }, { code: "'[disabled]': 'loading()'", explanation: 'Lie une propriété du host à l’état de la directive.' }, { code: "'[attr.aria-disabled]'", explanation: 'Expose aussi l’état aux technologies d’assistance.' }, { code: "alias: 'appDisableWhileLoading'", explanation: 'Permet au même attribut d’activer la directive et de recevoir sa valeur.' }],
    comparisons: [{ badge: 'Surface', title: 'Configuration host', description: 'Déclare classes, attributs et événements portés par l’élément hôte.', points: ['Lisible avec le composant', 'Bindings déclaratifs', 'Choix moderne'], recommended: true }, { badge: 'Template', title: 'Wrapper HTML', description: 'Ajoute un élément interne uniquement pour appliquer un comportement.', points: ['DOM supplémentaire', 'Peut gêner le layout', 'Parfois nécessaire pour la structure'] }],
    learning: {
      prerequisites: ['Connaître les directives et le property binding.'], mentalModel: 'Le host est la frontière DOM extérieure de ton composant, ou l’élément auquel ta directive est attachée. Les bindings host décrivent comment l’état Angular se reflète sur cette frontière.',
      definition: 'Les host bindings associent l’état d’un composant ou d’une directive aux propriétés, attributs et classes de son élément hôte. Les événements host permettent d’écouter les interactions reçues par cet élément.',
      why: 'Un comportement comme « désactivé pendant le chargement » doit rester cohérent partout : propriété disabled, classe visuelle et attribut accessible. Une directive rassemble ce contrat au même endroit.',
      steps: ['Identifier l’élément hôte.', 'Déclarer les inputs du comportement.', 'Relier état, classes et attributs dans host.', 'Écouter uniquement les événements nécessaires.', 'Appliquer la directive là où le comportement est requis.'],
      demoGuide: ['Identifie d’abord le bouton comme host.', 'Observe que disabled est une propriété et aria-disabled un attribut.', 'Vérifie que l’état reste fourni par le parent.', 'Réutilise ensuite la directive sans copier sa logique.'],
      useCases: [{ title: 'Accessibilité', description: 'Synchroniser rôle, aria-expanded ou aria-disabled.' }, { title: 'État visuel', description: 'Ajouter une classe selon l’état interne.' }, { title: 'Comportement', description: 'Directive autofocus, raccourci clavier ou état de chargement.' }],
      mistakes: ['Modifier directement classList alors qu’un binding host suffit.', 'Ajouter un div interne uniquement pour styler le host.', 'Bloquer un clic sans exposer l’état accessible.', 'Créer une directive métier trop dépendante d’un écran précis.'],
      takeaway: 'Le host exprime le contrat DOM extérieur ; garde sa configuration cohérente, déclarative et accessible.',
      exercises: ['Crée une directive aria-expanded.', 'Ajoute une classe is-active.', 'Explique la différence entre propriété disabled et aria-disabled.'],
      exerciseSolutions: ['Lie [attr.aria-expanded] à un input expanded.', 'Ajoute [class.is-active] dans host.', 'disabled bloque nativement le contrôle ; aria-disabled annonce l’état mais ne bloque pas seul l’interaction.'],
    }, current: 12, previousRoute: '../queries-references', nextRoute: '../smart-presentational',
  },

  'smart-presentational': {
    id: 'smart-presentational', category: 'Composants', sheetNumber: 13,
    title: 'Composition smart / presentational', description: 'Séparer orchestration et présentation sans appliquer mécaniquement une règle ancienne à chaque composant.', level: 'Intermédiaire', demoKind: 'composition',
    demoTitle: 'Construire une page de commandes', demoDescription: 'Le conteneur coordonne ; les composants de présentation décrivent l’interface.',
    demoActions: ['La route charge OrderPage', 'La page injecte la façade', 'OrderList reçoit les données', 'OrderList émet select', 'La page déclenche le cas d’usage'],
    demoResults: ['Le composant de route représente le scénario complet et constitue une frontière naturelle d’orchestration.', 'Il transforme les données de la façade en état de vue : chargement, commandes et erreur.', 'OrderList dépend seulement d’un tableau et peut être rendu dans Storybook ou testé sans HTTP.', 'L’enfant émet l’identifiant sélectionné ; il ne décide ni de la navigation ni du chargement métier.', 'La page appelle la façade ou le router. La décision reste au niveau qui possède le contexte.'],
    codeExamples: [
      { filename: 'order-page.ts', caption: 'Conteneur de route', code: `export class OrderPage {
  private readonly ordersFacade = inject(OrdersFacade);
  readonly orders = this.ordersFacade.orders;
  readonly loading = this.ordersFacade.loading;

  selectOrder(id: string): void {
    this.ordersFacade.open(id);
  }
}` },
      { filename: 'order-list.ts', caption: 'Composant de présentation', code: `export class OrderList {
  readonly orders = input.required<readonly OrderView[]>();
  readonly orderSelected = output<string>();
}

// order-list.html
// @for (order of orders(); track order.id) {
//   <button (click)="orderSelected.emit(order.id)">{{ order.label }}</button>
// }` },
    ],
    walkthrough: [{ code: 'inject(OrdersFacade)', explanation: 'Le conteneur accède au cas d’usage et à son état.' }, { code: 'input.required<readonly OrderView[]>()', explanation: 'Le présentational reçoit un modèle déjà adapté à l’affichage.' }, { code: 'output<string>()', explanation: 'Il remonte une intention minimale, sans connaître le scénario parent.' }],
    comparisons: [{ badge: 'Orchestration', title: 'Smart / container', description: 'Connaît la route, la façade ou plusieurs sources d’état.', points: ['Coordonne le scénario', 'Peu de HTML métier', 'Souvent au niveau page'] }, { badge: 'Affichage', title: 'Presentational', description: 'Reçoit des données et émet des intentions.', points: ['Test simple', 'API explicite', 'Réutilisation possible'], recommended: true }],
    learning: {
      prerequisites: ['Maîtriser input/output et l’injection de dépendances.'], mentalModel: 'La séparation n’est pas « intelligent contre stupide ». C’est une répartition de contexte : le conteneur sait d’où viennent les données et quoi faire des événements ; la vue sait comment les présenter.',
      definition: 'Un composant conteneur orchestre données et cas d’usage. Un composant de présentation rend des données reçues et émet des intentions. Ces rôles sont un outil de conception, pas deux catégories imposées par Angular.',
      why: 'Quand chaque composant visuel injecte directement routeur, API et store, sa réutilisation et ses tests deviennent artificiels. Extraire une vue pure clarifie les contrats, mais tout séparer sans besoin ajoute du bruit.',
      steps: ['Placer l’orchestration à une frontière naturelle, souvent la route.', 'Construire un modèle adapté à la vue.', 'Transmettre ce modèle par inputs.', 'Faire remonter les intentions par outputs.', 'Conserver un petit état purement visuel dans l’enfant si nécessaire.'],
      demoGuide: ['Repère la seule classe qui injecte la façade.', 'Observe que OrderList ignore la provenance des données.', 'Suis orderSelected jusqu’au cas d’usage.', 'Ne cherche pas à rendre chaque composant totalement pur.'],
      useCases: [{ title: 'Page de feature', description: 'Coordonne route, données et actions métier.' }, { title: 'Vue complexe', description: 'Table, liste ou formulaire présentable indépendamment.' }],
      mistakes: ['Interdire toute injection dans un composant de présentation, même pour un service purement UI.', 'Créer un conteneur pour chaque petit composant.', 'Transmettre des DTO serveur bruts à toute la vue.', 'Émettre dix événements techniques au lieu d’intentions métier.'],
      takeaway: 'Sépare quand cela rend le propriétaire des données et des décisions plus évident, pas pour respecter une étiquette.',
      exercises: ['Sépare une page commandes en conteneur et liste.', 'Crée un OrderView adapté au template.', 'Décide où conserver l’état expanded d’une ligne.'],
      exerciseSolutions: ['OrderPage injecte la façade ; OrderList reçoit orders et émet orderSelected.', 'Expose uniquement id, label, totalLabel et statusLabel.', 'S’il ne concerne que l’affichage de la ligne, garde-le localement dans la vue.'],
    }, current: 13, previousRoute: '../host-comportements', nextRoute: '../composants-dynamiques',
  },

  'dynamic-components': {
    id: 'dynamic-components', category: 'Composants', sheetNumber: 14,
    title: 'Composants dynamiques', description: 'Choisir et créer un composant à l’exécution quand un simple @if ne suffit plus.', level: 'Avancé', demoKind: 'dynamic',
    demoTitle: 'Afficher un widget choisi par configuration', demoDescription: 'La donnée détermine le type de vue sans coder une longue chaîne de conditions.',
    demoActions: ['Recevoir le type de widget', 'Résoudre le composant autorisé', 'Créer la vue', 'Fournir les inputs', 'Détruire ou remplacer la vue'],
    demoResults: ['Le serveur fournit une clé métier comme chart, counter ou message — jamais du code Angular arbitraire.', 'Une table locale transforme cette clé en type de composant connu et autorisé par l’application.', 'NgComponentOutlet ou ViewContainerRef instancie le type sélectionné dans la vue courante.', 'Les inputs sont transmis explicitement. Une interface commune évite de découvrir les contrats au hasard.', 'Quand la sélection change, Angular remplace la vue. Les instances détruites suivent leur cycle de vie normal.'],
    codeExamples: [
      { filename: 'dashboard.ts', caption: 'Approche déclarative avec NgComponentOutlet', code: `const WIDGETS: Record<WidgetKind, Type<unknown>> = {
  chart: ChartWidget,
  counter: CounterWidget,
  message: MessageWidget,
};

export class Dashboard {
  readonly config = input.required<WidgetConfig>();
  readonly component = computed(() => WIDGETS[this.config().kind]);
  readonly inputs = computed(() => ({ data: this.config().data }));
}

// dashboard.html
// <ng-container *ngComponentOutlet="component(); inputs: inputs()" />` },
      { filename: 'dialog-host.ts', caption: 'Création impérative quand un contrôle fin est nécessaire', code: `export class DialogHost {
  private readonly host = viewChild.required('host', { read: ViewContainerRef });

  open(component: Type<unknown>): void {
    this.host().clear();
    const ref = this.host().createComponent(component);
    ref.setInput('title', 'Confirmation');
  }
}` },
    ],
    walkthrough: [{ code: 'WIDGETS[this.config().kind]', explanation: 'Résout une clé externe vers une liste fermée de composants approuvés.' }, { code: 'NgComponentOutlet', explanation: 'Insère déclarativement le composant choisi et laisse Angular gérer sa vue.' }, { code: 'ViewContainerRef.createComponent', explanation: 'Crée impérativement une instance lorsque l’hôte doit la contrôler.' }, { code: 'ref.setInput(...)', explanation: 'Fournit un input en respectant le mécanisme Angular de mise à jour.' }],
    comparisons: [{ badge: 'Déclaratif', title: 'NgComponentOutlet', description: 'Le template affiche le type calculé.', points: ['Peu de code', 'Cycle géré par Angular', 'Choix par défaut'], recommended: true }, { badge: 'Impératif', title: 'ViewContainerRef', description: 'Le TypeScript crée, positionne et détruit la vue.', points: ['Contrôle précis', 'Références disponibles', 'Complexité supérieure'] }],
    learning: {
      prerequisites: ['Comprendre composants, inputs, cycle de vie et TypeScript Type.'], mentalModel: 'Un composant dynamique reste un composant Angular normal. La différence est que son type n’est pas écrit directement dans le template : il est choisi à l’exécution parmi des types connus.',
      definition: 'Un composant dynamique est un composant dont le type est déterminé pendant l’exécution. NgComponentOutlet fournit une approche déclarative ; ViewContainerRef permet une création impérative plus contrôlée.',
      why: 'Un dashboard configurable, un système de plugins interne ou une modale peut devoir afficher des types différents sans connaître à l’avance le choix exact. Une table de résolution évite une cascade de conditions.',
      steps: ['Définir une liste fermée de composants autorisés.', 'Associer chaque clé métier à un type.', 'Choisir le type depuis une configuration validée.', 'Créer la vue et fournir ses inputs.', 'Laisser Angular détruire la vue ou la nettoyer explicitement.'],
      demoGuide: ['Observe que le serveur ne fournit jamais une classe.', 'Repère la table WIDGETS comme frontière de sécurité.', 'Compare l’approche déclarative et impérative.', 'Vérifie que le composant créé reçoit un contrat explicite.'],
      useCases: [{ title: 'Dashboard', description: 'Widgets choisis par une configuration utilisateur.' }, { title: 'Dialogue', description: 'Contenu de modale différent selon le cas d’usage.' }, { title: 'Extension interne', description: 'Catalogue fermé de vues activables par configuration.' }],
      mistakes: ['Utiliser du dynamique pour remplacer trois @if lisibles.', 'Faire confiance à un nom de composant reçu du serveur.', 'Créer des composants sans détruire les anciennes références.', 'Supposer que tous les widgets ont les mêmes inputs sans contrat.'],
      takeaway: 'Le composant dynamique résout une variabilité de type réelle ; pour une simple variation d’état, garde un template déclaratif ordinaire.',
      exercises: ['Ajoute un widget weather à la table.', 'Refuse une clé inconnue.', 'Passe un input data avec NgComponentOutlet.'],
      exerciseSolutions: ['Ajoute weather: WeatherWidget dans WIDGETS et dans le type WidgetKind.', 'Valide la clé avec Object.hasOwn(WIDGETS, kind) et affiche un fallback.', 'Construis inputs = computed(() => ({ data: config().data })) puis utilise inputs: inputs().'],
    }, current: 14, previousRoute: '../smart-presentational', nextRoute: '../../reactivite/signals',
  },
};
