import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';

interface LabConcept {
  title: string;
  route?: string;
}

interface LabCategory {
  title: string;
  icon: string;
  concepts: LabConcept[];
}

@Component({
  selector: 'app-angular-lab',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet, ScrollAreaModule],
  templateUrl: './angular-lab.html',
  styleUrl: './angular-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularLab {
  readonly iconPath = '/icons/lab';
  readonly search = signal('');
  readonly expandedCategory = signal('Fondamentaux');

  readonly categories: LabCategory[] = [
    {
      title: 'Fondamentaux',
      icon: 'angular.png',
      concepts: [
        { title: 'Projet standalone et bootstrap', route: 'fondamentaux/standalone-bootstrap' },
        { title: 'Composants et templates', route: 'fondamentaux/composants-templates' },
        { title: 'Data binding', route: 'fondamentaux/data-binding' },
        { title: 'Directives et pipes', route: 'fondamentaux/directives-pipes' },
        { title: 'Injection de dépendances', route: 'fondamentaux/injection-dependances' },
        { title: 'Cycle de vie et rendu', route: 'fondamentaux/cycle-vie-rendu' },
        { title: 'HttpClient et intercepteurs', route: 'fondamentaux/http-intercepteurs' },
      ],
    },
    {
      title: 'Composants',
      icon: 'cube.png',
      concepts: [
        { title: 'Anatomie et responsabilité', route: 'composants/anatomie-responsabilite' },
        { title: 'Inputs, outputs et model', route: 'composants/inputs-outputs-model' },
        { title: 'Projection de contenu', route: 'composants/projection-contenu' },
        { title: 'Queries et références', route: 'composants/queries-references' },
        { title: 'Host bindings et comportements', route: 'composants/host-comportements' },
        { title: 'Composition smart / presentational', route: 'composants/smart-presentational' },
        { title: 'Composants dynamiques', route: 'composants/composants-dynamiques' },
      ],
    },
    {
      title: 'Signals',
      icon: 'trend.png',
      concepts: [
        { title: 'Signals', route: 'reactivite/signals' },
        { title: 'Computed et effect', route: 'reactivite/computed-effect' },
        { title: 'Interop Signals / RxJS', route: 'reactivite/interop-signals-rxjs' },
        { title: 'linkedSignal', route: 'signals/linked-signal' },
        { title: 'Inputs, outputs et model', route: 'signals/input-output-model' },
        { title: 'resource et httpResource', route: 'signals/resource-http-resource' },
      ],
    },
    {
      title: 'RxJS',
      icon: 'trend.png',
      concepts: [
        { title: 'Observables', route: 'reactivite/rxjs-observables' },
        { title: 'Subjects et partage', route: 'rxjs/subjects-partage' },
        { title: 'Opérateurs', route: 'rxjs/operateurs' },
        { title: 'Concurrence', route: 'rxjs/concurrence' },
        { title: 'Erreurs et retry', route: 'rxjs/erreurs-retry' },
        { title: 'Souscriptions sûres', route: 'rxjs/souscriptions' },
        { title: 'RxJS ou Signals ?', route: 'rxjs/rxjs-vs-signals' },
      ],
    },
    {
      title: 'Formulaires',
      icon: 'database.png',
      concepts: [
        { title: 'Choisir une approche', route: 'formulaires/choisir-approche' },
        { title: 'Formulaires réactifs', route: 'donnees-formulaires/formulaires-reactifs' },
        { title: 'Validation', route: 'donnees-formulaires/validation' },
        { title: 'FormArray et formulaires dynamiques', route: 'formulaires/form-array' },
        { title: 'Contrôles personnalisés', route: 'formulaires/controle-personnalise' },
        { title: 'Signal Forms', route: 'formulaires/signal-forms' },
        { title: 'Migration et coexistence', route: 'formulaires/migration-coexistence' },
      ],
    },
    {
      title: 'Routing',
      icon: 'architecture.png',
      concepts: [
        { title: 'Routing', route: 'architecture/routing' },
        { title: 'Lazy loading', route: 'architecture/lazy-loading' },
        { title: 'Paramètres et données', route: 'routing/parametres' },
        { title: 'Guards', route: 'routing/guards' },
        { title: 'Resolvers', route: 'routing/resolvers' },
        { title: 'Routes enfants et outlets', route: 'routing/routes-enfants-outlets' },
        { title: 'Cycle et erreurs', route: 'routing/cycle-erreurs' },
        { title: 'Tests du routing', route: 'routing/tests' },
      ],
    },
    {
      title: 'Architecture',
      icon: 'architecture.png',
      concepts: [
        { title: 'Gestion d’état', route: 'architecture/gestion-etat' },
        { title: 'Organisation par features', route: 'architecture/organisation-features' },
        { title: 'Frontières et couches', route: 'architecture/frontieres-couches' },
        { title: 'Data access, DTO et mapping', route: 'architecture/data-access-dto' },
        { title: 'Configuration et tokens', route: 'architecture/configuration-tokens' },
        { title: 'Erreurs et observabilité', route: 'architecture/erreurs-observabilite' },
        { title: 'Sécurité frontend', route: 'architecture/securite-frontend' },
        { title: 'Accessibilité et i18n', route: 'architecture/accessibilite-i18n' },
        { title: 'HttpClient', route: 'donnees-formulaires/http-client' },
        { title: 'Gestion des erreurs HTTP', route: 'donnees-formulaires/gestion-erreurs' },
      ],
    },
    {
      title: 'Performance',
      icon: 'rocket.png',
      concepts: [
        { title: 'Change detection', route: 'qualite-performance/change-detection' },
        { title: 'Performance', route: 'qualite-performance/performance' },
        { title: 'Zoneless', route: 'performance/zoneless' },
        { title: 'Listes et calculs', route: 'performance/listes-calculs' },
        { title: '@defer', route: 'performance/defer' },
        { title: 'Images et bundles', route: 'performance/images-bundles' },
        { title: 'SSR, SSG et hydratation', route: 'performance/ssr-ssg-hydratation' },
        { title: 'Budgets et monitoring', route: 'performance/budgets-monitoring' },
      ],
    },
    {
      title: 'Tests',
      icon: 'shield.png',
      concepts: [
        { title: 'Tests unitaires', route: 'qualite-performance/tests-unitaires' },
        { title: 'Tests end-to-end', route: 'qualite-performance/tests-end-to-end' },
        { title: 'Signals, inputs et outputs', route: 'tests/signals-inputs-outputs' },
        { title: 'HttpClient', route: 'tests/http' },
        { title: 'Router et guards', route: 'tests/router-guards' },
        { title: 'Component Harnesses', route: 'tests/component-harnesses' },
        { title: 'Blocs @defer', route: 'tests/defer' },
      ],
    },
    {
      title: 'Plateforme Web et PWA',
      icon: 'api.png',
      concepts: [
        { title: 'localStorage et sessionStorage', route: 'plateforme-web/stockage-navigateur' },
        { title: 'IndexedDB', route: 'plateforme-web/indexed-db' },
        { title: 'API navigateur et SSR', route: 'plateforme-web/compatibilite-ssr' },
        { title: 'Web Workers', route: 'plateforme-web/web-workers' },
        { title: 'Service Worker Angular', route: 'plateforme-web/service-worker-angular' },
        { title: 'Cache PWA et mode hors connexion', route: 'plateforme-web/cache-hors-ligne' },
        { title: 'Synchronisation différée', route: 'plateforme-web/synchronisation-hors-ligne' },
        { title: 'Synchronisation entre onglets', route: 'plateforme-web/broadcast-channel' },
        { title: 'Notifications et Push API', route: 'plateforme-web/notifications-push' },
      ],
    },
  ];

  readonly filteredCategories = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    if (!query) return this.categories;

    return this.categories
      .map((category) => ({
        ...category,
        concepts: category.concepts.filter((concept) =>
          `${category.title} ${concept.title}`.toLocaleLowerCase('fr').includes(query),
        ),
      }))
      .filter((category) => category.concepts.length > 0);
  });

  setSearch(value: string): void {
    this.search.set(value);
  }

  toggleCategory(title: string): void {
    this.expandedCategory.update((current) => (current === title ? '' : title));
  }
}
