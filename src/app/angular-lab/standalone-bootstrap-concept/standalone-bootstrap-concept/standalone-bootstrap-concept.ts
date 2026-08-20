import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CodePreview } from '../../shared/code-preview/code-preview';
import { ConceptComparison } from '../../shared/concept-comparison/concept-comparison';
import { ConceptHeader } from '../../shared/concept-header/concept-header';
import { ConceptLearning } from '../../shared/concept-learning/concept-learning';
import { ConceptPagination } from '../../shared/concept-pagination/concept-pagination';
import { ConceptTab, ConceptTabs } from '../../shared/concept-tabs/concept-tabs';
import { DemoHeader } from '../../shared/demo-header/demo-header';
import { ConceptComparisonItem, ConceptUseCase } from '../../shared/concept.models';

type Environment = 'development' | 'production';

@Component({
  selector: 'app-standalone-bootstrap-concept',
  standalone: true,
  imports: [
    CodePreview,
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
  readonly useCases: ConceptUseCase[] = [
    {
      title: 'Nouveau projet',
      description: 'Choix par défaut pour une application Angular moderne.',
    },
    {
      title: 'Migration progressive',
      description: 'Convertir route par route sans réécriture totale.',
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
