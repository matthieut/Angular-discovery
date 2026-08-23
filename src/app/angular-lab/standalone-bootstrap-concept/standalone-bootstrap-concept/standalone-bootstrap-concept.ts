import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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

type Environment = 'development' | 'production';

@Component({
  selector: 'app-standalone-bootstrap-concept',
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
  templateUrl: './standalone-bootstrap-concept.html',
  styleUrl: './standalone-bootstrap-concept.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandaloneBootstrapConcept {
  readonly iconPath = '/icons/lab';
  readonly activeTab = signal<ConceptTab>('demo');
  readonly environment = signal<Environment>('development');
  readonly routerEnabled = signal(true);
  readonly httpEnabled = signal(true);
  readonly interceptorEnabled = signal(true);
  readonly childImported = signal(false);

  readonly providerCount = computed(
    () =>
      [this.routerEnabled(), this.httpEnabled(), this.interceptorEnabled()].filter(Boolean).length,
  );

  readonly bootstrapCode = computed(() => {
    const providers = [
      this.routerEnabled() ? '    provideRouter(routes)' : null,
      this.httpEnabled()
        ? `    provideHttpClient(${this.interceptorEnabled() ? 'withInterceptors([authInterceptor])' : ''})`
        : null,
      `    { provide: APP_ENV, useValue: '${this.environment()}' }`,
    ]
      .filter(Boolean)
      .join(',\n');

    return `bootstrapApplication(AppComponent, {\n  providers: [\n${providers}\n  ]\n}).catch(console.error);`;
  });

  readonly implementationCode = `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(console.error);`;

  readonly standaloneComponentCode = `@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: '<a routerLink="/profile">{{ createdAt | date }}</a>'
})
export class UserCard {
  readonly createdAt = new Date();
}`;

  readonly parentComponentCode = `@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCard],
  template: '<app-user-card />'
})
export class UserList {}`;

  readonly routingConfigCode = `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

// app.component.ts
@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent {}`;

  readonly legacyBootstrapCode = `// Ancienne approche avec NgModule
platformBrowserDynamic().bootstrapModule(AppModule);

// Approche standalone moderne
bootstrapApplication(AppComponent, appConfig);`;

  readonly comparisons: ConceptComparisonItem[] = [
    {
      badge: 'Recommandé',
      title: 'API standalone',
      description: 'Un démarrage explicite, des imports locaux et des providers composables.',
      points: ['Moins de cérémonial', 'Dépendances visibles', 'Lazy loading naturel'],
      recommended: true,
    },
    {
      badge: 'Héritage',
      title: 'NgModule',
      description: 'Une organisation historique utile pendant certaines migrations progressives.',
      points: [
        'Conventions connues',
        'Regroupements parfois opaques',
        'Risque de SharedModule fourre-tout',
      ],
    },
  ];
  readonly learning: ConceptLearningContent = {
    definition:
      "Standalone signifie qu'un composant déclare lui-même les composants, directives et pipes utilisés par son template, au lieu d'être déclaré dans un NgModule. Le bootstrap est une autre notion : c'est l'étape qui démarre le composant racine.",
    why: 'Avec les composants standalone, les besoins du template sont visibles dans imports. bootstrapApplication indique ensuite à Angular quel composant créer en premier et quels services seront globaux.',
    steps: [
      'standalone: true rend le composant utilisable sans déclaration dans un NgModule.',
      'Le tableau imports contient ce que le template du composant utilise.',
      "Un parent importe explicitement un composant enfant avant d'utiliser son selector.",
      'main.ts appelle bootstrapApplication avec le composant racine.',
      'Le tableau providers configure des services ; il ne sert pas aux éléments du template.',
      'ApplicationConfig centralise les providers globaux ; RouterOutlet reste une dépendance du template à importer.',
    ],
    demoGuide: [
      "Simule d'abord l'import de UserCard : sans import, le selector est inconnu.",
      "Active ensuite Router, HttpClient et l'intercepteur dans la zone bootstrap.",
      'Observe que les éléments de template vont dans imports et les services dans providers.',
      'Le flux main.ts → bootstrapApplication → AppComponent représente le démarrage.',
    ],
    useCases: [
      {
        title: 'Nouveau projet',
        description: 'Utiliser bootstrapApplication et les APIs provideX dès la création.',
      },
      {
        title: 'Migration progressive',
        description: 'Remplacer un AppModule étape par étape sans réécrire toute l’application.',
      },
    ],
    mistakes: [
      'Croire que standalone signifie sans dépendances.',
      "Utiliser un composant enfant sans l'ajouter aux imports du parent.",
      'Mettre un service dans imports ou un composant dans providers.',
      "Déclarer dans main.ts des providers qui ne concernent qu'une route.",
    ],
    takeaway:
      "imports répond à « que peut utiliser ce template ? » ; providers à « quels services Angular peut-il injecter ? » ; bootstrapApplication à « quel composant démarre l'application ? ».",
    exercises: [
      'Ajoute un provider de configuration avec InjectionToken.',
      'Retire HttpClient et explique la conséquence.',
      "Migre le démarrage d'un petit AppModule vers bootstrapApplication.",
    ],
  };
  readonly walkthrough: CodeWalkthroughItem[] = [
    {
      code: 'standalone: true',
      explanation:
        "Le composant n'a pas besoin d'être déclaré dans un NgModule ; il porte directement ses dépendances de template.",
    },
    {
      code: 'imports: [UserCard]',
      explanation: 'Autorise le template du parent à utiliser le selector <app-user-card>.',
    },
    {
      code: 'bootstrapApplication(AppComponent, ...)',
      explanation:
        "Demande à Angular de démarrer l'application en utilisant AppComponent comme premier composant.",
    },
    {
      code: 'providers: [...]',
      explanation:
        "Liste les dépendances qui seront accessibles depuis l'injecteur global de l'application.",
    },
    {
      code: 'provideRouter(routes)',
      explanation: "Crée et configure le routeur avec le tableau de routes de l'application.",
    },
    {
      code: 'withInterceptors([authInterceptor])',
      explanation:
        "Ajoute une fonction exécutée pour les requêtes HTTP, ici afin de gérer l'authentification.",
    },
    {
      code: '.catch(console.error)',
      explanation:
        'Affiche dans la console une erreur survenue pendant le démarrage au lieu de la perdre silencieusement.',
    },
  ];

  selectTab(tab: ConceptTab): void {
    this.activeTab.set(tab);
  }

  setEnvironment(environment: Environment): void {
    this.environment.set(environment);
  }

  toggleProvider(provider: 'router' | 'http' | 'interceptor'): void {
    if (provider === 'router') this.routerEnabled.update((value) => !value);
    if (provider === 'http') {
      this.httpEnabled.update((value) => !value);
      if (!this.httpEnabled()) this.interceptorEnabled.set(false);
    }
    if (provider === 'interceptor' && this.httpEnabled()) {
      this.interceptorEnabled.update((value) => !value);
    }
  }
}
