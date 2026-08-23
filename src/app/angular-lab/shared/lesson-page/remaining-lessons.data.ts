import { LessonPageDefinition } from './lesson-page.models';

interface LessonSeed {
  id: string;
  route: string;
  category: string;
  title: string;
  description: string;
  level?: LessonPageDefinition['level'];
  definition: string;
  why: string;
  code: string;
  codeCaption: string;
  steps: string[];
  compare: [string, string, string, string];
  mistakes: string[];
  exercise: string;
  solution: string;
}

const seeds: LessonSeed[] = [
  {
    id: 'linked-signal', route: 'signals/linked-signal', category: 'Signals', title: 'linkedSignal',
    description: 'Conserver un état modifiable tout en le resynchronisant avec une autre donnée.',
    definition: 'linkedSignal crée un signal modifiable dont la valeur initiale, ou la valeur de remplacement, dépend d’autres signals. Contrairement à computed, l’utilisateur peut ensuite modifier cette valeur.',
    why: 'Il convient lorsqu’une sélection doit suivre une liste qui change : on garde le choix courant s’il existe encore, sinon on choisit une valeur de repli.',
    codeCaption: 'Une sélection qui reste valide quand la liste change',
    code: `readonly products = signal<Product[]>([]);
readonly selectedId = linkedSignal({
  source: this.products,
  computation: (products, previous) =>
    products.some(p => p.id === previous?.value)
      ? previous!.value
      : products[0]?.id ?? null,
});

select(id: number): void {
  this.selectedId.set(id);
}`,
    steps: ['Créer le signal source.', 'Décrire comment recalculer une valeur valide.', 'Lire selectedId() dans le template.', 'Autoriser une modification avec set().'],
    compare: ['computed', 'Valeur dérivée en lecture seule.', 'linkedSignal', 'Valeur dérivée mais encore modifiable.'],
    mistakes: ['Employer linkedSignal pour une valeur qui ne doit jamais être modifiée.', 'Oublier le cas où la source devient vide.'],
    exercise: 'Crée une langue sélectionnée qui revient à français si la langue courante disparaît.',
    solution: `readonly selected = linkedSignal(() => this.languages().includes('fr') ? 'fr' : this.languages()[0]);`,
  },
  {
    id: 'signal-input-output-model', route: 'signals/input-output-model', category: 'Signals', title: 'Inputs, outputs et model basés sur les signals',
    description: 'Écrire les contrats modernes d’un composant avec input(), output() et model().',
    definition: 'input expose une valeur reçue du parent sous forme de Signal. output émet un événement typé. model réunit une entrée et l’événement de mise à jour associé pour permettre une liaison bidirectionnelle explicite.',
    why: 'Ces API donnent des contrats typés, s’intègrent naturellement à computed et évitent les décorateurs tout en gardant un flux parent-enfant lisible.',
    codeCaption: 'Un sélecteur de quantité avec contrat signal',
    code: `export class QuantityPicker {
  readonly min = input(1);
  readonly changed = output<number>();
  readonly quantity = model.required<number>();

  increment(): void {
    const next = Math.max(this.min(), this.quantity() + 1);
    this.quantity.set(next);
    this.changed.emit(next);
  }
}

// Parent : <app-quantity-picker [(quantity)]="quantity" />`,
    steps: ['Déclarer les données reçues avec input.', 'Déclarer les événements métier avec output.', 'Réserver model aux vraies valeurs éditables.', 'Lire les inputs en appelant leur signal.'],
    compare: ['input + output', 'Deux intentions distinctes et explicites.', 'model', 'Une même valeur lue puis modifiée par l’enfant.'],
    mistakes: ['Utiliser model pour tous les inputs.', 'Modifier un input reçu au lieu d’émettre une intention.'],
    exercise: 'Crée un interrupteur avec un model checked et un output toggled.',
    solution: `checked = model(false); toggled = output<boolean>(); toggle() { this.checked.update(v => !v); this.toggled.emit(this.checked()); }`,
  },
  {
    id: 'resource-http-resource', route: 'signals/resource-http-resource', category: 'Signals', title: 'resource et httpResource',
    description: 'Représenter une donnée asynchrone avec sa valeur, son chargement et son erreur.', level: 'Avancé',
    definition: 'resource pilote une opération asynchrone à partir de paramètres réactifs. httpResource applique ce modèle aux requêtes HttpClient et expose value, status, isLoading et error sous forme de signals.',
    why: 'Une donnée distante ne se résume pas à sa valeur : l’interface doit également connaître son état de chargement, son échec éventuel et les rechargements.',
    codeCaption: 'Chargement réactif d’un utilisateur',
    code: `readonly userId = signal(1);
readonly user = httpResource<User>(
  () => \`/api/users/\${this.userId()}\`,
  { defaultValue: EMPTY_USER },
);

// user.value(), user.isLoading(), user.error(), user.reload()`,
    steps: ['Définir le paramètre réactif.', 'Créer la resource.', 'Afficher séparément loading, erreur et valeur.', 'Déclencher reload seulement pour le même paramètre.'],
    compare: ['HttpClient + RxJS', 'Flux paresseux et opérateurs riches.', 'httpResource', 'État HTTP directement consommable comme signals.'],
    mistakes: ['Lire value sans traiter l’erreur.', 'Créer la resource dans une méthode appelée souvent.', 'Confondre rechargement et changement de paramètres.'],
    exercise: 'Charge un produit dont l’identifiant vient d’un signal.',
    solution: `productId = signal(1); product = httpResource<Product>(() => \`/api/products/\${this.productId()}\`);`,
  },
  {
    id: 'rxjs-subjects-sharing', route: 'rxjs/subjects-partage', category: 'RxJS', title: 'Subjects et partage des flux',
    description: 'Comprendre Subject, BehaviorSubject et le partage d’une source.',
    definition: 'Un Subject est à la fois Observer et Observable : du code peut pousser des valeurs avec next. BehaviorSubject conserve une valeur courante. shareReplay partage une souscription et peut rejouer le dernier résultat.',
    why: 'Sans partage, deux abonnements à un Observable HTTP froid peuvent provoquer deux requêtes. Un Subject sert plutôt de frontière événementielle contrôlée.',
    codeCaption: 'Partager un résultat sans exposer next()',
    code: `private readonly refreshSubject = new Subject<void>();
readonly users$ = this.refreshSubject.pipe(
  startWith(undefined),
  switchMap(() => this.http.get<User[]>('/api/users')),
  shareReplay({ bufferSize: 1, refCount: true }),
);

refresh(): void { this.refreshSubject.next(); }`,
    steps: ['Garder le Subject privé.', 'Exposer seulement l’Observable dérivé.', 'Choisir si la dernière valeur doit être rejouée.', 'Configurer refCount selon la durée de vie attendue.'],
    compare: ['Subject', 'Diffuse uniquement les prochaines valeurs.', 'BehaviorSubject', 'Possède et rejoue une valeur courante.'],
    mistakes: ['Exposer publiquement le Subject.', 'Ajouter shareReplay partout sans comprendre sa mémoire.', 'Utiliser un Subject comme variable ordinaire.'],
    exercise: 'Crée un flux de recherche déclenché par un Subject<string>.',
    solution: `query$ = new Subject<string>(); results$ = this.query$.pipe(debounceTime(300), distinctUntilChanged(), switchMap(q => this.api.search(q)));`,
  },
  {
    id: 'rxjs-operators', route: 'rxjs/operateurs', category: 'RxJS', title: 'Opérateurs de transformation et de filtrage',
    description: 'Construire un pipeline lisible avec map, filter, tap et les opérateurs temporels.',
    definition: 'Un opérateur RxJS reçoit un Observable et retourne un nouvel Observable. map transforme, filter élimine, tap observe sans transformer, debounceTime attend une accalmie et distinctUntilChanged ignore les répétitions.',
    why: 'Le pipeline décrit chaque étape du traitement sans modifier la source et reste testable indépendamment de l’interface.',
    codeCaption: 'Pipeline de recherche utilisateur',
    code: `readonly results$ = this.query$.pipe(
  map(value => value.trim()),
  debounceTime(300),
  distinctUntilChanged(),
  filter(value => value.length >= 2),
  switchMap(value => this.api.search(value)),
);`,
    steps: ['Normaliser la valeur.', 'Réduire la fréquence des émissions.', 'Éliminer les valeurs inutiles.', 'Lancer le traitement asynchrone.'],
    compare: ['map', 'Transforme chaque valeur.', 'tap', 'Produit un effet d’observation sans changer la valeur.'],
    mistakes: ['Modifier une variable métier dans map.', 'Placer debounceTime après la requête.', 'Multiplier les subscribe imbriqués.'],
    exercise: 'Filtre les nombres pairs puis calcule leur carré.',
    solution: `numbers$.pipe(filter(n => n % 2 === 0), map(n => n * n));`,
  },
  {
    id: 'rxjs-concurrency', route: 'rxjs/concurrence', category: 'RxJS', title: 'Concurrence : switchMap, concatMap, mergeMap et exhaustMap',
    description: 'Choisir ce qui arrive lorsqu’une nouvelle action survient avant la fin de la précédente.', level: 'Intermédiaire',
    definition: 'Les opérateurs de flattening transforment chaque valeur en Observable puis organisent leur concurrence : switchMap remplace, concatMap met en file, mergeMap exécute en parallèle et exhaustMap ignore les nouvelles actions pendant le traitement.',
    why: 'Le bon choix dépend du sens métier : une recherche rend l’ancienne réponse inutile, alors qu’une sauvegarde ordonnée ne doit pas être annulée.',
    codeCaption: 'Empêcher le double envoi d’un formulaire',
    code: `readonly submitResult$ = this.submitClicks.pipe(
  exhaustMap(() => this.api.save(this.form.getRawValue())),
);`,
    steps: ['Identifier l’événement source.', 'Décider annulation, file, parallèle ou ignorance.', 'Choisir l’opérateur correspondant.', 'Tester deux événements très rapprochés.'],
    compare: ['switchMap', 'Annule logiquement le précédent : recherche.', 'concatMap', 'Conserve l’ordre : sauvegardes séquentielles.'],
    mistakes: ['Choisir switchMap pour une écriture qui ne doit pas être abandonnée.', 'Utiliser mergeMap sans limite sur une source rapide.'],
    exercise: 'Choisis un opérateur pour un bouton de connexion qui doit ignorer les doubles clics.',
    solution: 'Utiliser exhaustMap : tant que la connexion est en cours, les clics supplémentaires sont ignorés.',
  },
  {
    id: 'rxjs-errors-retry', route: 'rxjs/erreurs-retry', category: 'RxJS', title: 'Erreurs, retry et finalisation',
    description: 'Traiter un échec sans terminer involontairement tout le flux.',
    definition: 'catchError remplace un Observable en erreur, retry retente selon une stratégie et finalize exécute un nettoyage à la fin, que le flux réussisse ou échoue.',
    why: 'Une erreur termine un Observable. La position de catchError décide donc si seule une requête échoue ou si tout le flux utilisateur cesse de fonctionner.',
    codeCaption: 'Recherche résiliente sans casser le flux de saisie',
    code: `readonly results$ = this.query$.pipe(
  switchMap(query => this.api.search(query).pipe(
    retry({ count: 2, delay: 500 }),
    catchError(error => {
      this.message.set(toUserMessage(error));
      return of([]);
    }),
  )),
);`,
    steps: ['Identifier les erreurs réellement temporaires.', 'Limiter le nombre de tentatives.', 'Placer catchError au bon niveau.', 'Retourner un Observable de repli compatible.'],
    compare: ['catchError interne', 'La requête échoue mais la source reste active.', 'catchError externe', 'Tout le pipeline bascule vers le flux de repli.'],
    mistakes: ['Retry sur une erreur 400 métier.', 'Retourner une valeur au lieu d’un Observable dans catchError.', 'Masquer toute erreur sans informer l’utilisateur.'],
    exercise: 'Retourne une liste vide si le chargement échoue.',
    solution: `this.api.load().pipe(catchError(() => of([])));`,
  },
  {
    id: 'rxjs-subscriptions', route: 'rxjs/souscriptions', category: 'RxJS', title: 'AsyncPipe et takeUntilDestroyed',
    description: 'Éviter les fuites de souscription dans les composants.',
    definition: 'AsyncPipe souscrit depuis le template et se désabonne avec la vue. takeUntilDestroyed termine une souscription impérative lorsque le contexte Angular est détruit.',
    why: 'Une souscription qui survit au composant peut continuer à déclencher des effets, retenir de la mémoire ou dupliquer des traitements lors d’un retour sur la page.',
    codeCaption: 'Deux stratégies sûres selon le besoin',
    code: `readonly users$ = this.api.users();
// Template : @for (user of users$ | async; track user.id) { ... }

private readonly destroyRef = inject(DestroyRef);
ngOnInit(): void {
  this.events$.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(event => this.analytics.track(event));
}`,
    steps: ['Préférer AsyncPipe pour une valeur affichée.', 'Souscrire impérativement seulement pour un effet.', 'Lier cette souscription à DestroyRef.', 'Éviter les tableaux manuels de Subscription.'],
    compare: ['AsyncPipe', 'Valeur consommée par le template.', 'takeUntilDestroyed', 'Effet impératif contrôlé dans la classe.'],
    mistakes: ['Subscribe pour copier une valeur affichable dans une propriété.', 'Créer takeUntilDestroyed hors contexte d’injection sans DestroyRef.'],
    exercise: 'Affiche un compteur Observable sans subscribe dans la classe.',
    solution: `counter$ = interval(1000); // template : {{ counter$ | async }}`,
  },
  {
    id: 'rxjs-vs-signals', route: 'rxjs/rxjs-vs-signals', category: 'RxJS', title: 'RxJS ou Signals ?',
    description: 'Choisir entre état courant et suite d’événements asynchrones.',
    definition: 'Un Signal représente une valeur actuelle consultable immédiatement. Un Observable représente une suite de valeurs dans le temps, éventuellement asynchrone, avec composition, concurrence et annulation.',
    why: 'Les deux outils sont complémentaires : les signals conviennent à l’état de l’interface, RxJS aux événements et orchestrations asynchrones complexes.',
    codeCaption: 'Une frontière explicite entre flux et état',
    code: `readonly query = signal('');
readonly query$ = toObservable(this.query);
readonly results = toSignal(
  this.query$.pipe(
    debounceTime(300),
    switchMap(q => this.api.search(q)),
  ),
  { initialValue: [] },
);`,
    steps: ['Demander si la donnée a une valeur courante.', 'Identifier les besoins temporels ou de concurrence.', 'Choisir l’outil principal.', 'Convertir uniquement à une frontière claire.'],
    compare: ['Signals', 'État synchrone, dérivation et rendu.', 'RxJS', 'Flux temporels, concurrence et opérateurs.'],
    mistakes: ['Convertir sans cesse dans les deux sens.', 'Remplacer un pipeline complexe par plusieurs effects.', 'Utiliser BehaviorSubject uniquement pour obtenir une valeur courante.'],
    exercise: 'Choisis l’outil pour un thème courant puis pour une recherche avec annulation.',
    solution: 'Signal pour le thème ; Observable avec switchMap pour la recherche, éventuellement converti en signal à l’affichage.',
  },
  {
    id: 'forms-choose', route: 'formulaires/choisir-approche', category: 'Formulaires', title: 'Choisir une approche de formulaire',
    description: 'Comparer template-driven, Reactive Forms et Signal Forms.',
    definition: 'Angular propose trois modèles : template-driven pour les petits formulaires simples, Reactive Forms pour un modèle explicite et éprouvé, Signal Forms pour un modèle typé fondé sur les signals dans Angular 22 et plus.',
    why: 'Le choix dépend de la complexité, de la stabilité attendue, des validations, des champs dynamiques et des conventions de l’équipe.',
    codeCaption: 'Même intention, sources de vérité différentes',
    code: `// Reactive Forms
form = new FormGroup({ email: new FormControl('', { nonNullable: true }) });

// Signal Forms (Angular 22+)
model = signal({ email: '' });
loginForm = form(this.model);`,
    steps: ['Mesurer la complexité réelle.', 'Identifier la source de vérité souhaitée.', 'Vérifier la version Angular et les contraintes du projet.', 'Standardiser le choix dans l’équipe.'],
    compare: ['Reactive Forms', 'Mature, explicite et adapté aux formulaires complexes.', 'Signal Forms', 'Modèle signal typé et intégration réactive moderne.'],
    mistakes: ['Mélanger plusieurs modèles dans le même petit formulaire.', 'Choisir uniquement selon la quantité de code de la démo.'],
    exercise: 'Choisis une approche pour une newsletter à un champ et pour un configurateur dynamique.',
    solution: 'Template-driven peut suffire à la newsletter ; Reactive Forms ou Signal Forms convient au configurateur selon la version et l’expérience de l’équipe.',
  },
  {
    id: 'forms-array', route: 'formulaires/form-array', category: 'Formulaires', title: 'FormArray et formulaires dynamiques',
    description: 'Gérer une collection de groupes dont la taille varie.',
    definition: 'FormArray contient une liste ordonnée de contrôles ou de groupes. Il convient quand l’utilisateur peut ajouter, supprimer ou réordonner des éléments.',
    why: 'Un tableau TypeScript séparé du formulaire crée deux sources de vérité. FormArray garde valeurs, validation et état utilisateur dans le même arbre.',
    codeCaption: 'Liste dynamique de compétences',
    code: `readonly form = new FormGroup({
  skills: new FormArray<FormControl<string>>([]),
});
get skills() { return this.form.controls.skills; }
addSkill(): void {
  this.skills.push(new FormControl('', { nonNullable: true, validators: Validators.required }));
}
removeSkill(index: number): void { this.skills.removeAt(index); }`,
    steps: ['Définir le type d’un élément.', 'Créer le FormArray.', 'Ajouter et retirer via son API.', 'Afficher controls avec un track stable.'],
    compare: ['FormGroup', 'Ensemble de champs nommés et connus.', 'FormArray', 'Collection ordonnée de taille variable.'],
    mistakes: ['Modifier directement controls.', 'Utiliser l’index comme identité si les lignes sont réordonnées.', 'Oublier la validation de chaque élément.'],
    exercise: 'Ajoute une liste dynamique d’adresses composées de rue et ville.',
    solution: `addresses = new FormArray([new FormGroup({ street: new FormControl(''), city: new FormControl('') })]);`,
  },
  {
    id: 'forms-custom-control', route: 'formulaires/controle-personnalise', category: 'Formulaires', title: 'Contrôles personnalisés',
    description: 'Intégrer un composant métier à l’API des formulaires Angular.', level: 'Avancé',
    definition: 'ControlValueAccessor est le pont entre Angular Forms et un composant personnalisé. Angular lui transmet une valeur et des callbacks ; le composant signale ensuite les changements et le passage à l’état touched.',
    why: 'Un sélecteur d’adresse, de date ou de notation doit se comporter comme un input natif : valeur, désactivation, validation et état touché.',
    codeCaption: 'Contrat minimal d’un contrôle de notation',
    code: `export class RatingControl implements ControlValueAccessor {
  value = 0;
  disabled = false;
  private change = (value: number) => {};
  private touched = () => {};

  writeValue(value: number): void { this.value = value ?? 0; }
  registerOnChange(fn: (value: number) => void): void { this.change = fn; }
  registerOnTouched(fn: () => void): void { this.touched = fn; }
  setDisabledState(value: boolean): void { this.disabled = value; }
  select(value: number): void { this.value = value; this.change(value); this.touched(); }
}`,
    steps: ['Définir la valeur métier.', 'Implémenter les quatre méthodes du contrat.', 'Notifier seulement les actions utilisateur.', 'Tester disabled et touched.'],
    compare: ['Input/output maison', 'Convient hors formulaire Angular.', 'ControlValueAccessor', 'S’intègre à formControl et aux validateurs.'],
    mistakes: ['Appeler onChange depuis writeValue.', 'Ignorer setDisabledState.', 'Coupler le contrôle à un FormGroup parent précis.'],
    exercise: 'Ajoute le support disabled à un sélecteur de couleur.',
    solution: 'Stocker la valeur reçue par setDisabledState et désactiver les boutons du template sans émettre de changement.',
  },
  {
    id: 'signal-forms', route: 'formulaires/signal-forms', category: 'Formulaires', title: 'Signal Forms',
    description: 'Créer un formulaire dont le modèle, les champs et la validation reposent sur les signals.',
    definition: 'Signal Forms transforme un signal modèle en arbre de champs typé. La directive FormField synchronise un contrôle HTML et un champ ; un schéma centralise les règles de validation.',
    why: 'Cette approche réduit les synchronisations manuelles dans une application orientée signals et garde les accès aux champs entièrement typés.',
    codeCaption: 'Formulaire de connexion Angular 22+',
    code: `readonly model = signal({ email: '', password: '' });
readonly loginForm = form(this.model, schema => {
  required(schema.email);
  email(schema.email);
  minLength(schema.password, 8);
});

// <input [formField]="loginForm.email" />
// <input type="password" [formField]="loginForm.password" />`,
    steps: ['Créer le signal modèle.', 'Construire le FieldTree avec form.', 'Déclarer le schéma de validation.', 'Lier chaque champ avec FormField.'],
    compare: ['Reactive Forms', 'L’arbre de FormControl est la source de vérité.', 'Signal Forms', 'Le signal métier est la source de vérité.'],
    mistakes: ['Suivre un ancien tutoriel expérimental sans vérifier la version.', 'Muter directement un objet contenu dans le signal.', 'Afficher les erreurs avant interaction.'],
    exercise: 'Ajoute un champ nom obligatoire de trois caractères.',
    solution: `model = signal({ name: '' }); userForm = form(model, p => { required(p.name); minLength(p.name, 3); });`,
  },
  {
    id: 'forms-migration', route: 'formulaires/migration-coexistence', category: 'Formulaires', title: 'Migration et coexistence des formulaires',
    description: 'Faire évoluer un formulaire sans réécriture brutale.', level: 'Avancé',
    definition: 'Une migration sûre découpe le formulaire par frontières fonctionnelles, conserve un seul propriétaire par champ et adapte temporairement les valeurs entre anciennes et nouvelles API.',
    why: 'Réécrire un grand formulaire en une seule fois augmente les régressions sur validation, focus, accessibilité et sérialisation.',
    codeCaption: 'Une façade isole la représentation du formulaire',
    code: `interface ProfileDraft { name: string; email: string; }

// Le composant parent ne dépend que de ce contrat.
save(draft: ProfileDraft): void { this.api.save(draft); }

// Ancienne section : formGroup.getRawValue()
// Nouvelle section : profileModel()`,
    steps: ['Écrire des tests de comportement.', 'Découper en sous-formulaires autonomes.', 'Définir un DTO commun.', 'Migrer une frontière à la fois.', 'Supprimer l’adaptateur devenu inutile.'],
    compare: ['Big bang', 'Rapide en apparence, risque et revue élevés.', 'Migration progressive', 'Coexistence encadrée et retours arrière locaux.'],
    mistakes: ['Deux sources de vérité pour le même champ.', 'Partager directement des contrôles entre deux systèmes.', 'Migrer sans tests des erreurs affichées.'],
    exercise: 'Définis la première étape de migration d’un formulaire de commande.',
    solution: 'Isoler une section indépendante, par exemple l’adresse de livraison, définir son DTO et couvrir ses validations avant de la migrer.',
  },
  {
    id: 'routing-params', route: 'routing/parametres', category: 'Routing', title: 'Paramètres, query params et données de route',
    description: 'Transporter une identité, un filtre ou une configuration dans l’URL.',
    definition: 'Un paramètre de chemin identifie une ressource, un query param décrit souvent un filtre facultatif, et data contient une configuration statique définie par l’application.',
    why: 'Une URL bien conçue est partageable, rechargeable et compréhensible. Chaque type de donnée doit vivre au bon endroit.',
    codeCaption: 'Lire un identifiant et un filtre de manière réactive',
    code: `// route : products/:id
readonly id = toSignal(
  this.route.paramMap.pipe(map(params => params.get('id')!)),
);
readonly tab = toSignal(
  this.route.queryParamMap.pipe(map(params => params.get('tab') ?? 'details')),
);`,
    steps: ['Mettre l’identité dans le chemin.', 'Mettre les filtres facultatifs dans la query string.', 'Utiliser data pour la configuration statique.', 'Réagir aux changements sans supposer que le composant est recréé.'],
    compare: ['Paramètre de chemin', 'Identité structurante : /users/42.', 'Query param', 'Option facultative : ?tab=history.'],
    mistakes: ['Lire seulement snapshot si l’URL peut changer dans la même instance.', 'Mettre une donnée sensible dans l’URL.', 'Dupliquer l’état URL dans un service sans synchronisation.'],
    exercise: 'Conçois l’URL d’une liste de commandes filtrée par statut.',
    solution: '/orders?status=pending : orders désigne la ressource, status est un filtre facultatif.',
  },
  {
    id: 'routing-guards', route: 'routing/guards', category: 'Routing', title: 'Guards',
    description: 'Autoriser, refuser ou rediriger une navigation.',
    definition: 'Un guard est une fonction exécutée par le routeur avant une navigation. Il retourne true, false ou une redirection ; il ne remplace jamais la sécurité du serveur.',
    why: 'Les guards améliorent l’expérience en empêchant l’accès à une vue inadaptée ou la perte d’un brouillon non enregistré.',
    codeCaption: 'Rediriger un utilisateur non connecté',
    code: `export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// { path: 'admin', canActivate: [authGuard], loadComponent: ... }`,
    steps: ['Exprimer une règle de navigation.', 'Injecter seulement les dépendances utiles.', 'Retourner un UrlTree pour rediriger.', 'Faire appliquer l’autorisation réelle par l’API.'],
    compare: ['Guard client', 'Oriente la navigation et l’UX.', 'Autorisation serveur', 'Protège réellement les données et opérations.'],
    mistakes: ['Appeler navigate puis retourner false.', 'Considérer le guard comme une barrière de sécurité.', 'Créer un guard gigantesque mêlant plusieurs règles.'],
    exercise: 'Crée un guard qui redirige vers /forbidden si le rôle admin manque.',
    solution: `return auth.hasRole('admin') ? true : router.createUrlTree(['/forbidden']);`,
  },
  {
    id: 'routing-resolvers', route: 'routing/resolvers', category: 'Routing', title: 'Resolvers',
    description: 'Charger une donnée avant d’activer une route.',
    definition: 'Un resolver produit une donnée pendant la navigation. Le composant activé la reçoit via les données de route lorsque le chargement a réussi.',
    why: 'Il simplifie une page qui ne peut rien afficher sans sa donnée principale, mais retarde l’activation : il faut donc choisir cette attente consciemment.',
    codeCaption: 'Résoudre un projet avant la fiche',
    code: `export const projectResolver: ResolveFn<Project> = route =>
  inject(ProjectApi).get(route.paramMap.get('id')!);

// { path: 'projects/:id', resolve: { project: projectResolver } }
readonly project = toSignal(
  this.route.data.pipe(map(data => data['project'] as Project)),
);`,
    steps: ['Réserver le resolver à une donnée indispensable.', 'Récupérer les paramètres de route.', 'Retourner la donnée ou une redirection gérée.', 'Afficher un retour global pendant la navigation.'],
    compare: ['Resolver', 'La page attend avant activation.', 'Chargement composant', 'La page apparaît et gère son skeleton.'],
    mistakes: ['Résoudre toutes les données secondaires.', 'Ignorer l’erreur du resolver.', 'Dupliquer le même chargement dans le composant.'],
    exercise: 'Décide si les recommandations d’un produit doivent être dans le resolver.',
    solution: 'Non si elles sont secondaires : afficher la page produit puis charger les recommandations avec un skeleton local.',
  },
  {
    id: 'routing-nested-outlets', route: 'routing/routes-enfants-outlets', category: 'Routing', title: 'Routes enfants et outlets secondaires',
    description: 'Composer une interface à plusieurs zones navigables.', level: 'Intermédiaire',
    definition: 'Une route enfant s’affiche dans le router-outlet de son composant parent. Un outlet nommé permet une seconde branche d’URL, par exemple une fiche principale et un panneau latéral.',
    why: 'Les routes imbriquées modélisent une hiérarchie d’écran et conservent un layout commun sans le recréer à chaque sous-page.',
    codeCaption: 'Espace projet avec sous-navigation',
    code: `{ path: 'projects/:id', component: ProjectShell, children: [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', loadComponent: () => import('./overview') },
  { path: 'settings', loadComponent: () => import('./settings') },
] }

// project-shell.html contient <router-outlet />`,
    steps: ['Créer le composant layout.', 'Placer son router-outlet.', 'Déclarer les routes children.', 'Utiliser un outlet nommé seulement pour une navigation indépendante.'],
    compare: ['Route enfant', 'Une hiérarchie principale.', 'Outlet nommé', 'Une zone parallèle adressable dans l’URL.'],
    mistakes: ['Oublier le router-outlet du parent.', 'Employer un outlet secondaire pour une simple modale locale.', 'Construire les URL à la main.'],
    exercise: 'Ajoute un onglet activity sous projects/:id.',
    solution: `{ path: 'activity', loadComponent: () => import('./activity').then(m => m.Activity) }`,
  },
  {
    id: 'routing-cycle-errors', route: 'routing/cycle-erreurs', category: 'Routing', title: 'Cycle de navigation et erreurs',
    description: 'Observer le routeur et traiter annulations, redirections et échecs.', level: 'Avancé',
    definition: 'Une navigation traverse reconnaissance, guards, resolvers puis activation. Router.events publie les étapes et distingue succès, annulation et erreur.',
    why: 'Comprendre ce cycle évite les loaders bloqués et permet de diagnostiquer précisément une navigation interrompue.',
    codeCaption: 'Piloter un indicateur global de navigation',
    code: `readonly navigating = toSignal(
  this.router.events.pipe(
    filter(e => e instanceof NavigationStart || e instanceof NavigationEnd ||
      e instanceof NavigationCancel || e instanceof NavigationError),
    map(e => e instanceof NavigationStart),
  ),
  { initialValue: false },
);`,
    steps: ['Écouter seulement les événements nécessaires.', 'Activer sur NavigationStart.', 'Désactiver sur toutes les fins possibles.', 'Journaliser NavigationError avec son URL.'],
    compare: ['NavigationCancel', 'Navigation interrompue de manière attendue.', 'NavigationError', 'Exception non récupérée pendant la navigation.'],
    mistakes: ['Arrêter le loader uniquement sur NavigationEnd.', 'Afficher les détails techniques à l’utilisateur.', 'Déclencher une boucle de navigation dans le gestionnaire.'],
    exercise: 'Ajoute NavigationSkipped aux événements de fin selon ton besoin.',
    solution: 'Inclure NavigationSkipped dans le filter et laisser map retourner false pour cet événement.',
  },
  {
    id: 'routing-tests', route: 'routing/tests', category: 'Routing', title: 'Tester le routing',
    description: 'Vérifier routes, paramètres, guards et composants activés.',
    definition: 'RouterTestingHarness démarre un routeur de test, navigue vers une URL réelle et permet d’inspecter le composant ou le DOM activé.',
    why: 'Un test de routing utile vérifie le comportement observable de la navigation, pas seulement qu’un tableau de routes contient une chaîne.',
    codeCaption: 'Tester une redirection par guard',
    code: `TestBed.configureTestingModule({
  providers: [provideRouter(routes), { provide: AuthService, useValue: auth }],
});
const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/admin');
expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fadmin');`,
    steps: ['Configurer les vraies routes ciblées.', 'Remplacer seulement les dépendances externes.', 'Naviguer avec le harness.', 'Vérifier URL et rendu final.'],
    compare: ['Test unitaire du guard', 'Isole sa règle de décision.', 'Test avec RouterTestingHarness', 'Valide l’intégration de navigation.'],
    mistakes: ['Mocker entièrement Router.', 'Tester des détails internes du routeur.', 'Oublier les cas refus et redirection.'],
    exercise: 'Teste que /products/42 affiche le titre du produit 42.',
    solution: 'Configurer la route, simuler l’API ou le resolver, naviguer avec le harness puis vérifier le texte du routeNativeElement.',
  },
  {
    id: 'architecture-boundaries', route: 'architecture/frontieres-couches', category: 'Architecture', title: 'Frontières, couches et règles de dépendance',
    description: 'Organiser le code pour que le métier ne dépende pas de l’interface.',
    definition: 'Une frontière regroupe une responsabilité cohérente. Les dépendances doivent pointer des détails techniques vers le métier, jamais forcer le métier à connaître Angular, HTTP ou le stockage.',
    why: 'Des règles simples limitent l’effet domino : changer l’API ou une bibliothèque UI ne doit pas réécrire les règles métier.',
    codeCaption: 'Une dépendance orientée vers un port métier',
    code: `export abstract class OrdersRepository {
  abstract findAll(): Observable<Order[]>;
}

export const appConfig: ApplicationConfig = {
  providers: [{ provide: OrdersRepository, useClass: HttpOrdersRepository }],
};`,
    steps: ['Identifier le vocabulaire métier.', 'Définir les cas d’usage et leurs ports.', 'Implémenter les ports dans l’infrastructure.', 'Faire dépendre les composants des cas d’usage.'],
    compare: ['Couche par type', 'components/services/models globaux.', 'Frontière par feature', 'Code proche du besoin métier et dépendances contrôlées.'],
    mistakes: ['Créer une abstraction sans variante réelle.', 'Importer un composant depuis le domaine.', 'Partager un service fourre-tout entre toutes les features.'],
    exercise: 'Place Product, ProductPage et HttpProductRepository dans leurs couches.',
    solution: 'Product dans domain, ProductPage dans presentation, HttpProductRepository dans data/infrastructure.',
  },
  {
    id: 'architecture-data-access', route: 'architecture/data-access-dto', category: 'Architecture', title: 'Data access, DTO et mapping',
    description: 'Empêcher le contrat HTTP de contaminer toute l’application.',
    definition: 'Un DTO représente la forme échangée avec l’API. Un modèle métier représente les besoins de l’application. Un mapper traduit explicitement entre les deux.',
    why: 'Une date ISO, un nom de propriété serveur ou une valeur nullable ne devrait pas imposer ses détails aux composants.',
    codeCaption: 'Traduire un DTO en modèle métier',
    code: `interface OrderDto { id: string; created_at: string; total_cents: number; }
interface Order { id: string; createdAt: Date; total: number; }

const toOrder = (dto: OrderDto): Order => ({
  id: dto.id,
  createdAt: new Date(dto.created_at),
  total: dto.total_cents / 100,
});

findAll() { return this.http.get<OrderDto[]>('/api/orders').pipe(map(list => list.map(toOrder))); }`,
    steps: ['Typer honnêtement la réponse externe.', 'Valider si sa fiabilité est inconnue.', 'Mapper à la frontière data.', 'Exposer seulement le modèle utile.'],
    compare: ['DTO dans les composants', 'Moins de code initial, couplage diffus.', 'Mapping dédié', 'Contrat externe isolé et modèle cohérent.'],
    mistakes: ['Nommer une interface DTO alors qu’elle sert partout.', 'Cacher les conversions dans le template.', 'Faire confiance à un cast TypeScript comme validation runtime.'],
    exercise: 'Mappe price_in_cents en price exprimé en euros.',
    solution: `const toProduct = (dto: ProductDto): Product => ({ ...dto, price: dto.price_in_cents / 100 });`,
  },
  {
    id: 'architecture-config-tokens', route: 'architecture/configuration-tokens', category: 'Architecture', title: 'Configuration et InjectionToken',
    description: 'Injecter une configuration typée sans dépendre d’une variable globale.',
    definition: 'InjectionToken donne une identité runtime à une valeur qui n’est pas une classe, comme une URL, une configuration ou une stratégie.',
    why: 'Le code devient configurable par environnement et facilement remplaçable en test, tout en gardant un contrat TypeScript.',
    codeCaption: 'Fournir une configuration au bootstrap et au composant',
    code: `export interface ApiConfig { baseUrl: string; timeout: number; }
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

bootstrapApplication(App, {
  providers: [{ provide: API_CONFIG, useValue: { baseUrl: '/api', timeout: 5000 } }],
});

export class UsersPage {
  private readonly config = inject(API_CONFIG);
}`, 
    steps: ['Définir une interface minimale.', 'Créer l’InjectionToken.', 'Fournir la valeur au bon niveau.', 'Injecter le token sans lire directement environment.'],
    compare: ['Variable globale', 'Accès simple mais caché et difficile à remplacer.', 'InjectionToken', 'Dépendance explicite, typée et surchargeable.'],
    mistakes: ['Créer deux tokens différents avec le même libellé.', 'Fournir au composant une configuration qui doit être globale.', 'Mettre des secrets dans le frontend.'],
    exercise: 'Crée un token FEATURE_FLAGS et surcharge-le dans un composant de démonstration.',
    solution: `providers: [{ provide: FEATURE_FLAGS, useValue: { newCheckout: true } }]`,
  },
  {
    id: 'architecture-observability', route: 'architecture/erreurs-observabilite', category: 'Architecture', title: 'Erreurs et observabilité',
    description: 'Rendre les problèmes diagnostiquables sans exposer les détails techniques.',
    definition: 'La gestion d’erreur transforme un échec technique en comportement utilisateur. L’observabilité ajoute contexte, corrélation et mesure pour comprendre ce qui s’est produit en production.',
    why: 'Un message « une erreur est survenue » aide l’utilisateur mais pas l’équipe. Une stack brute fait l’inverse et peut divulguer des informations.',
    codeCaption: 'Centraliser le signalement sans avaler l’erreur',
    code: `export class GlobalErrorHandler implements ErrorHandler {
  private readonly reporter = inject(ErrorReporter);
  handleError(error: unknown): void {
    this.reporter.capture(normalizeError(error), {
      route: location.pathname,
      correlationId: crypto.randomUUID(),
    });
    console.error(error);
  }
}`,
    steps: ['Traiter localement les erreurs attendues.', 'Laisser remonter les erreurs inattendues.', 'Ajouter un contexte non sensible.', 'Relier logs frontend et backend par corrélation.'],
    compare: ['Erreur attendue', 'Validation ou 404 métier, message local.', 'Erreur inattendue', 'Défaut à signaler et diagnostiquer.'],
    mistakes: ['Journaliser tokens ou données personnelles.', 'Utiliser le handler global comme logique métier.', 'Avaler une erreur puis continuer dans un état incohérent.'],
    exercise: 'Liste trois champs de contexte sûrs pour une erreur de commande.',
    solution: 'Route, identifiant technique de corrélation et version de l’application ; éviter contenu du panier nominatif et jeton.',
  },
  {
    id: 'architecture-security', route: 'architecture/securite-frontend', category: 'Architecture', title: 'Sécurité frontend',
    description: 'Comprendre les protections Angular et les limites du navigateur.',
    definition: 'Angular échappe les interpolations et assainit certains bindings sensibles. Le frontend reste un environnement contrôlé par l’utilisateur : autorisations et validations doivent être imposées côté serveur.',
    why: 'La sécurité repose sur plusieurs couches : limiter le XSS, protéger les requêtes, éviter les secrets et ne jamais confondre bouton caché avec autorisation.',
    codeCaption: 'Laisser Angular traiter du texte non fiable',
    code: `readonly comment = input.required<string>();

// Sûr : Angular affiche du texte échappé
// <p>{{ comment() }}</p>

// À éviter sans besoin justifié : [innerHTML]
// Ne jamais contourner avec bypassSecurityTrustHtml pour du contenu utilisateur.`,
    steps: ['Afficher du texte avec interpolation.', 'Éviter les contournements de sanitization.', 'Configurer CSP et protections serveur.', 'Valider droits et données côté API.'],
    compare: ['Masquer un bouton', 'Décision d’interface seulement.', 'Refuser côté serveur', 'Contrôle d’autorisation réel.'],
    mistakes: ['Stocker un secret applicatif dans environment.', 'Faire confiance à bypassSecurityTrustHtml.', 'Supposer qu’un guard protège une API.'],
    exercise: 'Explique où vérifier qu’un utilisateur peut supprimer une commande.',
    solution: 'L’UI peut masquer le bouton, mais l’API doit authentifier l’utilisateur et vérifier son autorisation avant la suppression.',
  },
  {
    id: 'architecture-a11y-i18n', route: 'architecture/accessibilite-i18n', category: 'Architecture', title: 'Accessibilité et internationalisation',
    description: 'Concevoir dès le départ une interface utilisable et traduisible.',
    definition: 'L’accessibilité garantit notamment structure sémantique, clavier, focus, contraste et annonces utiles. L’internationalisation extrait les textes et adapte formats, pluriels et ordre des mots à la langue.',
    why: 'Ajouter ces préoccupations à la fin oblige souvent à refaire les composants, car elles influencent leur DOM, leurs contrats et leur mise en page.',
    codeCaption: 'Un contrôle accessible et un texte traduisible',
    code: `<button type="button"
  [attr.aria-expanded]="opened()"
  aria-controls="filters"
  (click)="opened.update(value => !value)">
  Filtres
</button>
<section id="filters" [hidden]="!opened()">...</section>

<!-- i18n -->
<p i18n>{count(), plural, =0 {Aucun résultat} one {1 résultat} other {{{count()}} résultats}}</p>`,
    steps: ['Choisir d’abord les éléments HTML natifs.', 'Rendre toutes les actions accessibles au clavier.', 'Gérer le focus lors des changements majeurs.', 'Extraire les textes sans concaténer des fragments.'],
    compare: ['HTML natif', 'Comportements clavier et sémantique intégrés.', 'div personnalisé', 'Tout doit être recréé et testé.'],
    mistakes: ['Utiliser aria pour réparer un mauvais élément HTML.', 'Mettre du texte seulement dans une image.', 'Concaténer des phrases traduites.'],
    exercise: 'Corrige un div cliquable utilisé comme bouton.',
    solution: 'Le remplacer par button type="button", conserver un libellé accessible et gérer le focus visible.',
  },
  {
    id: 'performance-zoneless', route: 'performance/zoneless', category: 'Performance', title: 'Angular zoneless',
    description: 'Faire fonctionner la détection de changements sans Zone.js.', level: 'Avancé',
    definition: 'En mode zoneless, Angular ne s’appuie plus sur le patch global de Zone.js. Les notifications viennent notamment des signals, des événements de template, d’AsyncPipe et de markForCheck.',
    why: 'Le modèle devient plus explicite, réduit certains surcoûts et facilite le diagnostic des mises à jour, mais le code doit utiliser des mécanismes qui notifient Angular.',
    codeCaption: 'Bootstrap zoneless et état notifiant',
    code: `bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],
});

export class Counter {
  readonly count = signal(0);
  increment(): void { this.count.update(value => value + 1); }
}`,
    steps: ['Vérifier les bibliothèques utilisées.', 'Activer le provider zoneless.', 'Représenter l’état UI avec signals ou AsyncPipe.', 'Tester timers, callbacks externes et composants tiers.'],
    compare: ['Avec Zone.js', 'Beaucoup d’activités peuvent déclencher une vérification.', 'Zoneless', 'Les notifications de rendu sont explicites.'],
    mistakes: ['Muter un champ ordinaire dans un callback tiers sans notifier Angular.', 'Confondre zoneless et absence de change detection.', 'Migrer sans tests UI.'],
    exercise: 'Transforme un compteur number mutable en signal compatible zoneless.',
    solution: `count = signal(0); increment() { this.count.update(v => v + 1); }`,
  },
  {
    id: 'performance-lists', route: 'performance/listes-calculs', category: 'Performance', title: 'Listes, tracking et calculs coûteux',
    description: 'Réduire le travail DOM et éviter les recalculs inutiles.',
    definition: 'L’expression track donne à Angular une identité stable pour réutiliser les vues d’une liste. computed mémorise une dérivation tant que ses dépendances ne changent pas.',
    why: 'Sans bonne identité, un tri ou un rafraîchissement peut recréer des lignes, perdre le focus et répéter des calculs coûteux.',
    codeCaption: 'Liste filtrée avec identité stable',
    code: `readonly query = signal('');
readonly visibleUsers = computed(() => {
  const query = this.query().toLowerCase();
  return this.users().filter(user => user.name.toLowerCase().includes(query));
});

// @for (user of visibleUsers(); track user.id) { <app-user-row [user]="user" /> }`,
    steps: ['Choisir une vraie clé métier stable.', 'Déplacer les calculs hors du template.', 'Utiliser computed pour une dérivation.', 'Profiler avant une optimisation plus complexe.'],
    compare: ['track user.id', 'Réutilise la ligne représentant le même utilisateur.', 'track $index', 'Identité liée à la position, fragile lors des insertions.'],
    mistakes: ['Appeler une fonction coûteuse à chaque interpolation.', 'Générer une nouvelle clé aléatoire.', 'Utiliser $index pour une liste réordonnable.'],
    exercise: 'Corrige une liste de commandes suivie par $index.',
    solution: `@for (order of orders(); track order.id) { ... }`,
  },
  {
    id: 'performance-defer', route: 'performance/defer', category: 'Performance', title: '@defer et vues différées',
    description: 'Retarder le code et le rendu d’une zone non prioritaire.',
    definition: '@defer sépare les dépendances d’un bloc dans un chunk chargé selon un déclencheur. placeholder, loading et error décrivent les états de l’interface.',
    why: 'Une carte lourde située sous la ligne de flottaison ne doit pas ralentir le contenu principal visible immédiatement.',
    codeCaption: 'Charger un graphique lorsqu’il approche du viewport',
    code: `@defer (on viewport; prefetch on idle) {
  <app-heavy-chart [data]="data()" />
} @placeholder (minimum 200ms) {
  <div class="chart-skeleton">Graphique à venir</div>
} @loading {
  <app-spinner />
} @error {
  <p>Le graphique n’a pas pu être chargé.</p>
}`,
    steps: ['Identifier une zone réellement non critique.', 'Choisir un déclencheur mesurable.', 'Réserver l’espace avec placeholder.', 'Prévoir loading et error.', 'Vérifier le découpage du bundle.'],
    compare: ['on viewport', 'Charge quand la zone approche de l’écran.', 'on interaction', 'Charge après une action explicite.'],
    mistakes: ['Différer le contenu principal LCP.', 'Oublier la hauteur du placeholder.', 'Ajouter @defer sans vérifier qu’un chunk est créé.'],
    exercise: 'Diffère un éditeur riche jusqu’au clic sur son placeholder.',
    solution: `@defer (on interaction) { <app-editor /> } @placeholder { <button>Ouvrir l’éditeur</button> }`,
  },
  {
    id: 'performance-assets', route: 'performance/images-bundles', category: 'Performance', title: 'Images, ressources et bundles',
    description: 'Optimiser les octets réellement téléchargés par le navigateur.',
    definition: 'NgOptimizedImage aide à dimensionner et prioriser les images. Le lazy loading des routes, les imports ciblés et l’analyse de bundle limitent le JavaScript initial.',
    why: 'Une application peut avoir un rendu efficace mais rester lente parce qu’elle télécharge trop d’images, de polices ou de bibliothèques avant d’être interactive.',
    codeCaption: 'Image dimensionnée et prioritaire',
    code: `<img ngSrc="/images/hero.webp"
  width="1200" height="630"
  priority
  sizes="(max-width: 700px) 100vw, 1200px"
  alt="Vue de la plateforme" />

// Route secondaire chargée à la demande
{ path: 'reports', loadComponent: () => import('./reports').then(m => m.Reports) }`,
    steps: ['Mesurer réseau et bundle.', 'Choisir le bon format et les dimensions.', 'Prioriser seulement l’image principale.', 'Découper les routes et fonctions secondaires.', 'Supprimer les dépendances inutilisées.'],
    compare: ['priority', 'Ressource critique visible immédiatement.', 'loading paresseux', 'Ressource hors écran ou secondaire.'],
    mistakes: ['Mettre priority sur toutes les images.', 'Redimensionner une énorme image uniquement en CSS.', 'Importer une bibliothèque entière pour une fonction.'],
    exercise: 'Optimise une image de carte située sous la ligne de flottaison.',
    solution: 'Fournir width/height, un fichier WebP/AVIF à la bonne taille et ne pas la marquer priority.',
  },
  {
    id: 'performance-rendering', route: 'performance/ssr-ssg-hydratation', category: 'Performance', title: 'SSR, SSG et hydratation',
    description: 'Choisir où produire le HTML et comment Angular reprend la page.', level: 'Avancé',
    definition: 'Le CSR rend dans le navigateur, le SSR rend à chaque requête serveur, le SSG prérend à la construction. L’hydratation réutilise ensuite le DOM serveur au lieu de le recréer côté client.',
    why: 'Le choix influence premier affichage, SEO, coût serveur, fraîcheur des données et complexité du code universel.',
    codeCaption: 'Activer l’hydratation côté navigateur',
    code: `export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
  ],
};

// Le code exécuté au serveur ne doit pas accéder directement à window ou document.`,
    steps: ['Classer les routes par fraîcheur et SEO.', 'Choisir CSR, SSR ou prerender par route.', 'Écrire du code compatible serveur.', 'Activer l’hydratation.', 'Tester le HTML initial et les interactions précoces.'],
    compare: ['SSR', 'HTML frais calculé à la requête, coût serveur.', 'SSG', 'HTML précalculé, diffusion rapide, données moins fraîches.'],
    mistakes: ['Accéder à window pendant le rendu serveur.', 'Refaire côté client une requête déjà transférée.', 'Choisir SSR sans besoin mesuré.'],
    exercise: 'Choisis un mode pour une page marketing stable et un tableau de bord privé.',
    solution: 'SSG pour la page marketing ; CSR est souvent adapté au tableau de bord privé, éventuellement SSR selon contraintes précises.',
  },
  {
    id: 'performance-budgets', route: 'performance/budgets-monitoring', category: 'Performance', title: 'Budgets et suivi continu',
    description: 'Empêcher les régressions de performance de s’installer.',
    definition: 'Un budget fixe une limite vérifiable sur la taille d’un bundle. Le suivi continu complète cette limite par des mesures de terrain et de laboratoire comme les Core Web Vitals.',
    why: 'Une optimisation ponctuelle disparaît progressivement si chaque fonctionnalité ajoute quelques kilo-octets ou ralentit le rendu sans seuil partagé.',
    codeCaption: 'Budget Angular CLI dans angular.json',
    code: `"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kB",
    "maximumError": "700kB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "8kB"
  }
]`,
    steps: ['Mesurer la base actuelle.', 'Définir des seuils réalistes.', 'Faire échouer la CI sur une régression majeure.', 'Suivre LCP, INP et CLS en production.', 'Associer chaque alerte à une action.'],
    compare: ['Mesure laboratoire', 'Reproductible avant livraison.', 'Mesure terrain', 'Reflète appareils, réseaux et utilisateurs réels.'],
    mistakes: ['Copier un budget arbitraire.', 'Ne mesurer que la taille totale.', 'Collecter des métriques sans responsable ni seuil.'],
    exercise: 'Propose une règle CI pour un bundle initial de référence à 450 kB.',
    solution: 'Par exemple warning à 500 kB et erreur à 550 kB, puis ajuster selon la trajectoire produit documentée.',
  },
  {
    id: 'tests-signals-io', route: 'tests/signals-inputs-outputs', category: 'Tests', title: 'Tester signals, inputs et outputs',
    description: 'Vérifier état dérivé et contrat public d’un composant.',
    definition: 'Un test de signal manipule la source puis observe la dérivation. ComponentRef.setInput fournit un input comme Angular le ferait et OutputEmitterRef permet de vérifier les événements émis.',
    why: 'Tester le contrat public rend le test robuste aux refactorings internes et valide les mises à jour réactives réelles.',
    codeCaption: 'Tester un input et un output modernes',
    code: `const fixture = TestBed.createComponent(QuantityPicker);
fixture.componentRef.setInput('min', 2);
fixture.componentRef.setInput('quantity', 2);
const emitted: number[] = [];
fixture.componentInstance.changed.subscribe(value => emitted.push(value));

fixture.componentInstance.increment();
expect(emitted).toEqual([3]);`,
    steps: ['Créer le composant avec TestBed.', 'Fournir les inputs via ComponentRef.', 'Observer l’output.', 'Déclencher une action publique.', 'Vérifier résultat et DOM utile.'],
    compare: ['Test d’implémentation', 'Inspecte des champs privés fragiles.', 'Test de contrat', 'Manipule inputs, actions et outputs publics.'],
    mistakes: ['Affecter directement un input signal.', 'Tester computed sans modifier ses sources.', 'Appeler detectChanges sans raison partout.'],
    exercise: 'Teste qu’un compteur ne descend pas sous son input min.',
    solution: 'Définir min avec setInput, déclencher decrement puis vérifier l’output et le texte rendu.',
  },
  {
    id: 'tests-http', route: 'tests/http', category: 'Tests', title: 'Tester HttpClient',
    description: 'Contrôler requête et réponse sans appeler un vrai serveur.',
    definition: 'provideHttpClientTesting installe un backend de test. HttpTestingController intercepte les requêtes, permet de vérifier URL et méthode puis fournit réponse ou erreur.',
    why: 'Le test doit valider le contrat HTTP du service de manière rapide et déterministe, sans réseau ni environnement externe.',
    codeCaption: 'Tester le chargement et le mapping des utilisateurs',
    code: `TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting(), UsersApi],
});
const api = TestBed.inject(UsersApi);
const http = TestBed.inject(HttpTestingController);

api.findAll().subscribe(users => expect(users[0].name).toBe('Ada'));
const request = http.expectOne('/api/users');
expect(request.request.method).toBe('GET');
request.flush([{ id: 1, display_name: 'Ada' }]);
http.verify();`,
    steps: ['Configurer client puis backend de test.', 'Appeler la méthode publique.', 'Attendre la requête exacte.', 'Vérifier sa forme.', 'Répondre avec flush et vérifier qu’il ne reste rien.'],
    compare: ['Test HttpClient', 'Contrat du service frontend isolé.', 'Test E2E', 'Intégration réelle avec toute la chaîne.'],
    mistakes: ['Oublier http.verify.', 'Tester l’implémentation interne plutôt que la requête.', 'Utiliser un vrai endpoint.'],
    exercise: 'Simule une réponse 404 et vérifie le comportement du service.',
    solution: `Utiliser request.flush('Not found', { status: 404, statusText: 'Not Found' }), puis vérifier l’erreur ou le repli prévu.`,
  },
  {
    id: 'tests-router-guards', route: 'tests/router-guards', category: 'Tests', title: 'Tester Router et guards',
    description: 'Valider une navigation autorisée, refusée ou redirigée.',
    definition: 'Un guard fonctionnel peut être testé dans un contexte d’injection ; RouterTestingHarness valide ensuite son intégration avec les routes et le composant final.',
    why: 'La règle et son branchement peuvent échouer séparément. Deux tests courts donnent un diagnostic plus précis qu’un seul scénario opaque.',
    codeCaption: 'Tester l’intégration d’un guard avec le routeur',
    code: `TestBed.configureTestingModule({
  providers: [
    provideRouter([{ path: 'admin', canActivate: [authGuard], component: AdminPage }]),
    { provide: AuthService, useValue: { isAuthenticated: () => false } },
  ],
});
const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/admin');
expect(TestBed.inject(Router).url).toBe('/login');`,
    steps: ['Tester les branches de la règle.', 'Configurer une route minimale.', 'Naviguer réellement.', 'Vérifier la destination finale.'],
    compare: ['Guard seul', 'Décision métier rapide à diagnostiquer.', 'Harness', 'Branchement et résultat de navigation.'],
    mistakes: ['Ne tester que le cas autorisé.', 'Mocker Router.navigate au lieu de vérifier l’URL.', 'Oublier une redirection asynchrone.'],
    exercise: 'Teste un guard admin avec un utilisateur connecté sans rôle.',
    solution: 'Simuler hasRole à false, naviguer vers /admin et vérifier la redirection /forbidden.',
  },
  {
    id: 'tests-harnesses', route: 'tests/component-harnesses', category: 'Tests', title: 'Component Harnesses',
    description: 'Tester un composant par une API utilisateur stable.', level: 'Avancé',
    definition: 'Un Component Harness encapsule les sélecteurs et interactions d’un composant. Les tests utilisent des méthodes comme getValue ou click au lieu de connaître son DOM interne.',
    why: 'Quand beaucoup de tests manipulent le même composant riche, centraliser son vocabulaire réduit les duplications et le coût des changements de structure HTML.',
    codeCaption: 'Harness minimal pour un sélecteur de quantité',
    code: `export class QuantityHarness extends ComponentHarness {
  static hostSelector = 'app-quantity-picker';
  private readonly plus = this.locatorFor('[data-testid="increment"]');
  private readonly value = this.locatorFor('[data-testid="value"]');

  async increment(): Promise<void> { await (await this.plus()).click(); }
  async getValue(): Promise<number> {
    return Number(await (await this.value()).text());
  }
}`,
    steps: ['Définir le hostSelector.', 'Cacher les locators dans le harness.', 'Exposer des actions métier.', 'Réutiliser le harness dans les tests.'],
    compare: ['Page object ponctuel', 'Utile à l’échelle d’une page.', 'Component Harness', 'Contrat réutilisable d’un composant.'],
    mistakes: ['Exposer chaque élément DOM au lieu d’actions métier.', 'Créer un harness pour un composant trivial utilisé une fois.', 'Utiliser des sélecteurs CSS visuels fragiles.'],
    exercise: 'Ajoute une méthode isDisabled au harness.',
    solution: `async isDisabled() { return (await this.plus()).getProperty<boolean>('disabled'); }`,
  },
  {
    id: 'tests-defer', route: 'tests/defer', category: 'Tests', title: 'Tester les blocs @defer',
    description: 'Contrôler placeholder, chargement et rendu final d’une vue différée.', level: 'Avancé',
    definition: 'Le TestBed peut piloter manuellement les blocs différés. Le test récupère un DeferBlockFixture puis passe explicitement par les états Placeholder, Loading ou Complete.',
    why: 'Un bloc différé possède plusieurs interfaces et un chargement asynchrone ; tester uniquement le contenu final laisse les états intermédiaires non couverts.',
    codeCaption: 'Piloter un bloc différé en test',
    code: `TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual });
const fixture = TestBed.createComponent(Dashboard);
await fixture.whenStable();
const [block] = await fixture.getDeferBlocks();

await block.render(DeferBlockState.Placeholder);
expect(fixture.nativeElement.textContent).toContain('Graphique à venir');

await block.render(DeferBlockState.Complete);
expect(fixture.nativeElement.querySelector('app-heavy-chart')).toBeTruthy();`,
    steps: ['Activer le comportement manuel.', 'Créer le composant.', 'Récupérer le bloc.', 'Rendre chaque état important.', 'Vérifier le comportement visible.'],
    compare: ['Déclenchement réel', 'Valide viewport ou interaction en E2E.', 'Rendu manuel', 'Test de composant rapide et déterministe.'],
    mistakes: ['Attendre le viewport dans un test unitaire.', 'Ne tester que Complete.', 'Coupler le test au contenu interne du composant différé.'],
    exercise: 'Ajoute une assertion sur l’état Loading.',
    solution: `await block.render(DeferBlockState.Loading); expect(fixture.nativeElement.textContent).toContain('Chargement');`,
  },
  {
    id: 'browser-storage', route: 'plateforme-web/stockage-navigateur', category: 'Plateforme Web et PWA', title: 'localStorage et sessionStorage',
    description: 'Persister de petites préférences sans disperser les accès aux API du navigateur.',
    definition: 'localStorage conserve des chaînes entre les sessions du navigateur. sessionStorage est limité à la durée de vie d’un onglet. Ces API sont synchrones, limitées en capacité et absentes pendant un rendu serveur.',
    why: 'Une préférence de thème ou un filtre peut survivre à un rechargement, mais l’accès doit être encapsulé pour rester testable, compatible SSR et résistant aux données invalides.',
    codeCaption: 'Un stockage injectable, typé et compatible avec le rendu serveur',
    code: `export const BROWSER_STORAGE = new InjectionToken<Storage>('BROWSER_STORAGE');

export const browserStorageProvider: Provider = {
  provide: BROWSER_STORAGE,
  useFactory: () => isPlatformBrowser(inject(PLATFORM_ID))
    ? localStorage
    : new MemoryStorage(),
};

@Injectable({ providedIn: 'root' })
export class PreferencesStore {
  private readonly storage = inject(BROWSER_STORAGE);
  readonly theme = signal(this.storage.getItem('theme') ?? 'dark');

  setTheme(theme: 'dark' | 'light'): void {
    this.theme.set(theme);
    try { this.storage.setItem('theme', theme); }
    catch { /* quota ou stockage indisponible : garder l’état mémoire */ }
  }
}`,
    steps: ['Créer un token représentant Storage.', 'Fournir localStorage uniquement dans le navigateur.', 'Initialiser un signal depuis une valeur persistée.', 'Mettre à jour le signal et le stockage en traitant les erreurs.'],
    compare: ['localStorage', 'Persiste après fermeture et réouverture.', 'sessionStorage', 'Persiste seulement dans l’onglet courant.'],
    mistakes: ['Stocker des mots de passe ou des secrets.', 'Lire window.localStorage au chargement du module.', 'Supposer que setItem réussit toujours.', 'Oublier que toutes les valeurs sont des chaînes.'],
    exercise: 'Ajoute une préférence de densité compact/comfortable.',
    solution: `density = signal(this.storage.getItem('density') ?? 'comfortable'); setDensity(value) { this.density.set(value); this.storage.setItem('density', value); }`,
  },
  {
    id: 'indexed-db', route: 'plateforme-web/indexed-db', category: 'Plateforme Web et PWA', title: 'IndexedDB',
    description: 'Stocker localement des données structurées et volumineuses avec une API asynchrone.', level: 'Avancé',
    definition: 'IndexedDB est une base transactionnelle intégrée au navigateur. Elle stocke des objets structurés, utilise des object stores et des index, et travaille de manière asynchrone.',
    why: 'Elle convient à un catalogue hors connexion, une file de modifications ou un cache métier trop riche pour localStorage. Son schéma et ses migrations doivent être gérés explicitement.',
    codeCaption: 'Créer une base et enregistrer une intervention',
    code: `function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('maintenance', 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('interventions', { keyPath: 'id' });
      store.createIndex('status', 'status');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function save(intervention: Intervention): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction('interventions', 'readwrite');
  transaction.objectStore('interventions').put(intervention);
  await transactionDone(transaction);
}`,
    steps: ['Ouvrir une base avec un numéro de version.', 'Créer stores et index pendant onupgradeneeded.', 'Ouvrir une transaction adaptée.', 'Attendre la fin réelle de la transaction.'],
    compare: ['localStorage', 'Petites chaînes lues de façon synchrone.', 'IndexedDB', 'Objets structurés, transactions et accès asynchrones.'],
    mistakes: ['Accéder à IndexedDB pendant le SSR.', 'Fermer la promesse avant la fin de la transaction.', 'Modifier un schéma sans augmenter sa version.', 'Utiliser IndexedDB pour une simple préférence.'],
    exercise: 'Ajoute un index technicianId aux interventions.',
    solution: `store.createIndex('technicianId', 'technicianId', { unique: false });`,
  },
  {
    id: 'browser-ssr', route: 'plateforme-web/compatibilite-ssr', category: 'Plateforme Web et PWA', title: 'API navigateur et compatibilité SSR',
    description: 'Utiliser window, document et navigator sans casser le rendu serveur.',
    definition: 'Le code Angular peut s’exécuter dans le navigateur ou sur le serveur. window, navigator, localStorage et certaines API graphiques n’existent que dans un environnement navigateur.',
    why: 'Un accès global exécuté dans un constructeur ou à l’évaluation d’un module peut faire échouer toute une route SSR avant même son affichage.',
    codeCaption: 'Isoler une API navigateur derrière un service',
    code: `@Injectable({ providedIn: 'root' })
export class BrowserCapabilities {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  supportsWorkers(): boolean {
    return this.isBrowser && typeof Worker !== 'undefined';
  }

  viewportWidth(): number | null {
    return this.isBrowser ? window.innerWidth : null;
  }
}

afterNextRender(() => {
  // DOM disponible : initialiser ici une bibliothèque strictement navigateur.
});`,
    steps: ['Identifier le code susceptible de s’exécuter au serveur.', 'Détecter la plateforme avant l’accès global.', 'Retourner un repli explicite.', 'Reporter les initialisations DOM après le rendu navigateur.'],
    compare: ['isPlatformBrowser', 'Protège une branche de code selon la plateforme.', 'afterNextRender', 'Planifie un effet lorsque le DOM navigateur est disponible.'],
    mistakes: ['Écrire const width = window.innerWidth au niveau du module.', 'Cacher tous les problèmes SSR avec optional chaining.', 'Produire un HTML serveur différent sans gérer l’hydratation.'],
    exercise: 'Rends un service Clipboard compatible SSR.',
    solution: `copy(text) { return this.isBrowser && navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.resolve(); }`,
  },
  {
    id: 'web-workers', route: 'plateforme-web/web-workers', category: 'Plateforme Web et PWA', title: 'Web Workers',
    description: 'Déplacer un calcul CPU coûteux hors du thread qui affiche l’interface.', level: 'Avancé',
    definition: 'Un Web Worker exécute du JavaScript dans un thread séparé. Le composant et le worker communiquent par messages ; le worker ne peut pas manipuler le DOM ni utiliser directement l’injection Angular du composant.',
    why: 'Une agrégation cartographique ou un traitement de milliers d’objets peut bloquer les clics et animations. Le Worker maintient le thread principal disponible, au prix d’une communication et d’un transfert de données.',
    codeCaption: 'Calculer des statistiques sans bloquer l’interface',
    code: `// statistics.worker.ts
addEventListener('message', ({ data }: MessageEvent<number[]>) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  postMessage({ total, average: total / data.length });
});

// statistics-page.ts
readonly result = signal<Statistics | null>(null);
readonly calculating = signal(false);

calculate(values: number[]): void {
  if (typeof Worker === 'undefined') {
    this.result.set(calculateSynchronously(values));
    return;
  }
  const worker = new Worker(new URL('./statistics.worker', import.meta.url));
  this.calculating.set(true);
  worker.onmessage = ({ data }: MessageEvent<Statistics>) => {
    this.result.set(data);
    this.calculating.set(false);
    worker.terminate();
  };
  worker.onerror = () => { this.calculating.set(false); worker.terminate(); };
  worker.postMessage(values);
}`,
    steps: ['Écrire un worker autonome recevant un message.', 'Retourner un résultat sérialisable avec postMessage.', 'Créer le Worker via new URL pour le build Angular.', 'Traiter résultat et erreur puis terminer le Worker.'],
    compare: ['Thread principal', 'Accès à l’UI mais risque de blocage pendant un calcul lourd.', 'Web Worker', 'Calcul parallèle sans DOM, avec coût de communication.'],
    mistakes: ['Créer un Worker pour un calcul trivial.', 'Essayer d’injecter un service Angular dans le worker.', 'Transférer d’énormes objets inutilement.', 'Oublier terminate et la stratégie de repli.'],
    exercise: 'Déplace le filtrage de 100 000 points cartographiques dans un Worker.',
    solution: 'Envoyer les données et critères au worker, filtrer dans son gestionnaire message, retourner uniquement les identifiants utiles puis terminer ou réutiliser le worker.',
  },
  {
    id: 'angular-service-worker', route: 'plateforme-web/service-worker-angular', category: 'Plateforme Web et PWA', title: 'Service Worker Angular',
    description: 'Installer le shell de l’application et servir des ressources depuis un cache contrôlé.', level: 'Avancé',
    definition: 'Le Service Worker Angular est un script persistant géré par @angular/service-worker. Il intercepte les requêtes correspondant à ngsw-config.json et maintient des versions cohérentes des fichiers de l’application.',
    why: 'Il accélère les retours sur l’application et peut rendre son shell disponible hors connexion, mais introduit un cache durable qui doit être configuré et exploité avec discipline.',
    codeCaption: 'Activer la PWA et configurer le cache applicatif',
    code: `// Installation
// ng add @angular/pwa

// app.config.ts
providers: [
  provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000',
  }),
]

// ngsw-config.json
{
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": { "files": ["/*.css", "/*.js", "/index.html"] }
  }]
}`,
    steps: ['Installer @angular/pwa avec le CLI.', 'Enregistrer ngsw-worker.js en production.', 'Décrire les ressources dans ngsw-config.json.', 'Tester avec un build de production et un contexte sécurisé.'],
    compare: ['Web Worker', 'Exécute un calcul demandé par la page.', 'Service Worker', 'Intercepte réseau, cache et événements en dehors de la page.'],
    mistakes: ['Tester uniquement avec le serveur de développement standard.', 'Mettre toutes les API en cache sans stratégie.', 'Confondre cache et sauvegarde métier.', 'Déployer les fichiers d’une version de manière non atomique.'],
    exercise: 'Explique pourquoi le service worker est désactivé en développement dans cet exemple.',
    solution: 'Pour éviter qu’un cache persistant masque les modifications locales et rende le diagnostic incohérent ; il faut tester explicitement un build de production.',
  },
  {
    id: 'pwa-cache-offline', route: 'plateforme-web/cache-hors-ligne', category: 'Plateforme Web et PWA', title: 'Cache PWA et mode hors connexion',
    description: 'Choisir entre rapidité, fraîcheur et disponibilité pour chaque ressource.', level: 'Avancé',
    definition: 'Dans ngsw-config.json, assetGroups gère les fichiers de l’application et dataGroups les requêtes de données. performance préfère le cache ; freshness tente le réseau avant un repli cache.',
    why: 'Une stratégie unique est dangereuse : un référentiel stable peut tolérer une donnée ancienne, mais un stock ou une intervention critique exige une fraîcheur clairement définie.',
    codeCaption: 'Deux politiques de cache pour deux besoins métier',
    code: `{
  "dataGroups": [
    {
      "name": "catalogue",
      "urls": ["/api/catalogue/**"],
      "cacheConfig": {
        "strategy": "performance", "maxSize": 100,
        "maxAge": "1d", "refreshAhead": "1h"
      }
    },
    {
      "name": "interventions",
      "urls": ["/api/interventions/**"],
      "cacheConfig": {
        "strategy": "freshness", "maxSize": 30,
        "maxAge": "10m", "timeout": "3s"
      }
    }
  ]
}`,
    steps: ['Classer les données par exigence de fraîcheur.', 'Choisir performance ou freshness.', 'Limiter taille et durée du cache.', 'Définir l’interface lorsque la donnée est ancienne ou absente.'],
    compare: ['performance', 'Répond d’abord depuis le cache puis actualise selon la politique.', 'freshness', 'Préfère le réseau et utilise le cache comme repli.'],
    mistakes: ['Mettre en cache les écritures POST comme des lectures.', 'Afficher une donnée cachée sans indiquer son ancienneté.', 'Choisir une durée uniquement pour économiser le réseau.'],
    exercise: 'Choisis une stratégie pour une liste de pays et pour une disponibilité temps réel.',
    solution: 'performance avec longue durée pour les pays ; freshness avec timeout court, voire absence de cache, pour une disponibilité réellement critique.',
  },
  {
    id: 'offline-sync', route: 'plateforme-web/synchronisation-hors-ligne', category: 'Plateforme Web et PWA', title: 'Écritures hors ligne et synchronisation différée',
    description: 'Mettre en file les actions locales et résoudre les conflits au retour du réseau.', level: 'Avancé',
    definition: 'Une stratégie offline-first enregistre localement une commande métier avec un identifiant unique et un statut pending, puis la rejoue lorsque le réseau revient. Le serveur doit garantir l’idempotence et signaler les conflits.',
    why: 'Mettre une réponse GET en cache ne suffit pas pour une application terrain : les agents doivent pouvoir créer des interventions, joindre des données et connaître l’état réel de synchronisation.',
    codeCaption: 'File locale d’opérations idempotentes',
    code: `interface PendingOperation {
  id: string;
  type: 'complete-intervention';
  payload: { interventionId: string; completedAt: string };
  status: 'pending' | 'failed';
}

async queueCompletion(interventionId: string): Promise<void> {
  await this.queue.put({
    id: crypto.randomUUID(),
    type: 'complete-intervention',
    payload: { interventionId, completedAt: new Date().toISOString() },
    status: 'pending',
  });
}

async synchronize(): Promise<void> {
  for (const operation of await this.queue.pending()) {
    await this.api.execute(operation, { idempotencyKey: operation.id });
    await this.queue.remove(operation.id);
  }
}`,
    steps: ['Définir une opération métier sérialisable.', 'L’enregistrer localement avec un identifiant stable.', 'Rejouer les opérations dans un ordre défini.', 'Supprimer uniquement après confirmation serveur.', 'Présenter les conflits à l’utilisateur.'],
    compare: ['Cache de lecture', 'Rend une ancienne réponse consultable.', 'File d’écriture', 'Conserve une intention à transmettre au serveur.'],
    mistakes: ['Considérer navigator.onLine comme preuve que l’API répond.', 'Rejouer une écriture non idempotente sans clé.', 'Effacer une opération avant la réponse serveur.', 'Masquer les conflits métier.'],
    exercise: 'Définis la clé d’idempotence d’un ajout de photo hors ligne.',
    solution: 'Générer l’identifiant UUID au moment de la mise en file et réutiliser exactement ce même identifiant lors de chaque nouvelle tentative.',
  },
  {
    id: 'broadcast-channel', route: 'plateforme-web/broadcast-channel', category: 'Plateforme Web et PWA', title: 'Synchronisation entre onglets',
    description: 'Informer les autres contextes de la même origine sans serveur.', level: 'Intermédiaire',
    definition: 'BroadcastChannel permet à plusieurs onglets, fenêtres ou workers de même origine de publier et recevoir des messages sur un canal nommé. L’événement storage fournit un repli plus limité pour localStorage.',
    why: 'Une déconnexion, un changement de thème ou une mise à jour locale peut devoir être répercuté immédiatement dans tous les onglets ouverts.',
    codeCaption: 'Synchroniser la déconnexion entre onglets',
    code: `@Injectable({ providedIn: 'root' })
export class SessionChannel implements OnDestroy {
  private readonly channel = typeof BroadcastChannel === 'undefined'
    ? null
    : new BroadcastChannel('session');
  readonly loggedOut = signal(false);

  constructor() {
    this.channel?.addEventListener('message', event => {
      if (event.data?.type === 'logout') this.loggedOut.set(true);
    });
  }

  announceLogout(): void {
    this.loggedOut.set(true);
    this.channel?.postMessage({ type: 'logout' });
  }

  ngOnDestroy(): void { this.channel?.close(); }
}`,
    steps: ['Créer un canal seulement si l’API existe.', 'Définir des messages discriminés.', 'Mettre à jour l’état local à la réception.', 'Fermer le canal avec son propriétaire.'],
    compare: ['BroadcastChannel', 'Messages explicites entre plusieurs contextes de même origine.', 'Événement storage', 'Réagit aux modifications localStorage effectuées dans un autre document.'],
    mistakes: ['Transmettre un secret dans les messages.', 'Oublier que l’expéditeur ne reçoit pas son propre message.', 'Ne pas vérifier la forme de event.data.', 'Laisser les canaux ouverts inutilement.'],
    exercise: 'Ajoute un message theme-changed typé.',
    solution: `type SessionMessage = { type: 'logout' } | { type: 'theme-changed'; theme: 'dark' | 'light' };`,
  },
  {
    id: 'push-notifications', route: 'plateforme-web/notifications-push', category: 'Plateforme Web et PWA', title: 'Notifications et Push API',
    description: 'Recevoir une notification même lorsque l’application n’est pas au premier plan.', level: 'Avancé',
    definition: 'L’API Notifications affiche une notification avec l’autorisation de l’utilisateur. Push API transmet un message à un Service Worker via un abonnement ; le backend doit stocker cet abonnement et envoyer les messages.',
    why: 'Une alerte d’intervention critique peut devoir parvenir à l’utilisateur hors de l’onglet, mais la permission doit être demandée au moment où la valeur est claire, jamais automatiquement au chargement.',
    codeCaption: 'Demander la permission puis créer un abonnement push Angular',
    code: `@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  private readonly push = inject(SwPush);
  private readonly http = inject(HttpClient);

  async subscribe(): Promise<void> {
    if (!this.push.isEnabled || Notification.permission === 'denied') return;
    const subscription = await this.push.requestSubscription({
      serverPublicKey: environment.vapidPublicKey,
    });
    await firstValueFrom(this.http.post('/api/push/subscriptions', subscription));
  }
}

// Déclencher subscribe() après une action explicite de l’utilisateur.`,
    steps: ['Expliquer la valeur avant de demander la permission.', 'Vérifier disponibilité et refus antérieur.', 'Créer l’abonnement avec la clé publique VAPID.', 'Envoyer l’abonnement au backend.', 'Gérer expiration et désinscription.'],
    compare: ['Notification locale', 'Créée par une page ou un worker déjà actif.', 'Push', 'Message initié par un serveur et reçu par le Service Worker.'],
    mistakes: ['Demander la permission dès l’arrivée sur le site.', 'Traiter la clé privée VAPID dans le frontend.', 'Considérer un abonnement comme permanent.', 'Envoyer des informations sensibles dans le texte de notification.'],
    exercise: 'Définis le moment approprié pour demander la permission dans une application de maintenance.',
    solution: 'Après que l’utilisateur active explicitement « Recevoir les alertes critiques » et après une explication claire des notifications envoyées.',
  },
];

const allRoutes = seeds.map(seed => `/lab/${seed.route}`);

function buildLesson(seed: LessonSeed, index: number): LessonPageDefinition {
  const previousRoute = index === 0 ? '/lab/reactivite/interop-signals-rxjs' : allRoutes[index - 1];
  const nextRoute = index === seeds.length - 1 ? '/lab/qualite-performance/tests-end-to-end' : allRoutes[index + 1];
  const codeLines = seed.code.split('\n').filter(line => line.trim().length > 0);
  const codeForStep = seed.steps.map((_, stepIndex) => {
    const start = Math.floor((stepIndex * codeLines.length) / seed.steps.length);
    const next = Math.floor(((stepIndex + 1) * codeLines.length) / seed.steps.length);
    const end = Math.max(start + 1, next);
    return codeLines.slice(start, end).join('\n');
  });

  return {
    id: seed.id,
    category: seed.category,
    sheetNumber: 31 + index,
    title: seed.title,
    description: seed.description,
    level: seed.level ?? 'Intermédiaire',
    demoKind: 'concept',
    demoTitle: `Comprendre ${seed.title}`,
    demoDescription: seed.why,
    demoActions: seed.steps,
    demoResults: seed.steps.map((step, stepIndex) =>
      `Étape ${stepIndex + 1} — ${step} Angular peut alors appliquer le mécanisme de façon explicite et vérifiable.`,
    ),
    demoCode: codeForStep,
    codeExamples: [{ filename: `${seed.id}.ts`, caption: seed.codeCaption, code: seed.code }],
    walkthrough: seed.steps.map((step, stepIndex) => ({
      code: codeForStep[stepIndex],
      explanation: `${step} Cet extrait est la partie de l’exemple complet qui matérialise cette décision.`,
    })),
    comparisons: [
      { badge: 'Option A', title: seed.compare[0], description: seed.compare[1], points: ['Comprendre sa source de vérité', 'Vérifier son cycle de vie'], recommended: false },
      { badge: 'Option B', title: seed.compare[2], description: seed.compare[3], points: ['Choisir selon le besoin métier', 'Tester le comportement observable'], recommended: true },
    ],
    learning: {
      prerequisites: ['Savoir lire un composant standalone et une classe TypeScript.', 'Comprendre la différence entre une donnée, un événement et un effet de bord.'],
      mentalModel: `${seed.definition} Imagine ce mécanisme comme une responsabilité précise dans la chaîne : une entrée connue, une transformation explicite et un résultat observable.`,
      definition: seed.definition,
      why: seed.why,
      steps: seed.steps,
      demoGuide: seed.steps.map((step, stepIndex) => `Sélectionne l’étape ${stepIndex + 1} et repère ceci : ${step}`),
      useCases: [
        { title: 'Cas simple', description: `Utiliser ${seed.title} lorsque le besoin correspond directement à sa responsabilité.` },
        { title: 'Application métier', description: seed.why },
        { title: 'Décision d’équipe', description: `Documenter pourquoi ${seed.compare[2]} est retenu plutôt que ${seed.compare[0]}.` },
      ],
      mistakes: seed.mistakes,
      takeaway: `${seed.title} n’est pas une syntaxe à appliquer automatiquement : pars du comportement attendu, puis choisis cette solution lorsqu’elle rend le flux plus explicite.`,
      exercises: [seed.exercise, `Explique avec tes mots la différence entre ${seed.compare[0]} et ${seed.compare[2]}.`],
      exerciseSolutions: [seed.solution, `${seed.compare[0]} : ${seed.compare[1]} ${seed.compare[2]} : ${seed.compare[3]}`],
    },
    current: 31 + index,
    previousRoute,
    nextRoute,
  };
}

export const REMAINING_LESSONS: Record<string, LessonPageDefinition> = Object.fromEntries(
  seeds.map((seed, index) => [seed.id, buildLesson(seed, index)]),
);
