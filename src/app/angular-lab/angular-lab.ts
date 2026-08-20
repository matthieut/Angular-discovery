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
        { title: 'HttpClient' },
        { title: 'Formulaires réactifs' },
        { title: 'Validation' },
        { title: 'Gestion des erreurs' },
      ],
    },
    {
      title: 'Architecture',
      icon: 'architecture.png',
      concepts: [
        { title: 'Routing' },
        { title: 'Lazy loading' },
        { title: 'Gestion d’état' },
        { title: 'Organisation par features' },
      ],
    },
    {
      title: 'Qualité et performance',
      icon: 'rocket.png',
      concepts: [
        { title: 'Change detection' },
        { title: 'Performance' },
        { title: 'Tests unitaires' },
        { title: 'Tests end-to-end' },
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
