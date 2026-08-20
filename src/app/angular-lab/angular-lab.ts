import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandaloneBootstrapConcept } from './standalone-bootstrap-concept/standalone-bootstrap-concept/standalone-bootstrap-concept';
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
})
export class AngularLab {
readonly iconPath = '/icons';
  readonly search = signal('');
  readonly expandedCategory = signal('Fondamentaux');
  readonly selectedConcept = signal('Projet standalone et bootstrap');

  readonly categories: LabCategory[] = [
    {
      title: 'Fondamentaux',
      icon: 'angular.png',
      concepts: [
        { title: 'Projet standalone et bootstrap', route: 'fondamentaux/standalone-bootstrap' },
        { title: 'Composants et templates' },
        { title: 'Data binding' },
        { title: 'Directives et pipes' },
        { title: 'Injection de dépendances' },
      ],
    },
    {
      title: 'Réactivité',
      icon: 'trend.png',
      concepts: [
        { title: 'Signals' },
        { title: 'Computed et effect' },
        { title: 'RxJS et Observables' },
        { title: 'Interop Signals / RxJS' },
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
      .map(category => ({
        ...category,
        concepts: category.concepts.filter(concept =>
          `${category.title} ${concept.title}`.toLocaleLowerCase('fr').includes(query),
        ),
      }))
      .filter(category => category.concepts.length > 0);
  });

  setSearch(value: string): void {
    this.search.set(value);
  }

  toggleCategory(title: string): void {
    this.expandedCategory.update(current => current === title ? '' : title);
  }
}
