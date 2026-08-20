import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';
import { LabTopMenu } from './shared/lab-top-menu/lab-top-menu';

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
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet, ScrollAreaModule, LabTopMenu],
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
      title: 'Réactivité',
      icon: 'trend.png',
      concepts: [
        { title: 'Signals', route: 'reactivite/signals' },
        { title: 'Computed et effect', route: 'reactivite/computed-effect' },
        { title: 'RxJS et Observables', route: 'reactivite/rxjs-observables' },
        { title: 'Interop Signals / RxJS', route: 'reactivite/interop-signals-rxjs' },
      ],
    },
    {
      title: 'Données et formulaires',
      icon: 'database.png',
      concepts: [
        { title: 'HttpClient', route: 'donnees-formulaires/http-client' },
        { title: 'Formulaires réactifs', route: 'donnees-formulaires/formulaires-reactifs' },
        { title: 'Validation', route: 'donnees-formulaires/validation' },
        { title: 'Gestion des erreurs', route: 'donnees-formulaires/gestion-erreurs' },
      ],
    },
    {
      title: 'Architecture',
      icon: 'architecture.png',
      concepts: [
        { title: 'Routing', route: 'architecture/routing' },
        { title: 'Lazy loading', route: 'architecture/lazy-loading' },
        { title: 'Gestion d’état', route: 'architecture/gestion-etat' },
        { title: 'Organisation par features', route: 'architecture/organisation-features' },
      ],
    },
    {
      title: 'Qualité et performance',
      icon: 'rocket.png',
      concepts: [
        { title: 'Change detection', route: 'qualite-performance/change-detection' },
        { title: 'Performance', route: 'qualite-performance/performance' },
        { title: 'Tests unitaires', route: 'qualite-performance/tests-unitaires' },
        { title: 'Tests end-to-end', route: 'qualite-performance/tests-end-to-end' },
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
