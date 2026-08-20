import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';

type ProjectCategory = 'Tous' | '.NET' | 'Angular' | 'Architecture' | 'Smart City';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  categories: Exclude<ProjectCategory, 'Tous'>[];
  metric: string;
  metricLabel: string;
  route: string;
  icon: string;
}


@Component({
  selector: 'app-portfolio-component',
  imports: [RouterLink, ScrollAreaModule],
  templateUrl: './portfolio-component.html',
  styleUrl: './portfolio-component.scss',
})
export class PortfolioComponent {
  readonly iconPath = '/icons';
  readonly categories: ProjectCategory[] = ['Tous', '.NET', 'Angular', 'Architecture', 'Smart City'];
  readonly categoryIcons: Record<ProjectCategory, string> = {
    'Tous': 'grid.png',
    '.NET': 'dotnet.png',
    'Angular': 'angular.png',
    'Architecture': 'architecture.png',
    'Smart City': 'smartcity.png',
  };
  readonly selectedCategory = signal<ProjectCategory>('Tous');

  readonly secondaryProjects: Project[] = [
    {
      title: 'Modernisation NextCity',
      subtitle: 'WPF → Angular · API REST',
      description: 'Refonte progressive d’une solution métier historique vers une architecture Web moderne.',
      categories: ['.NET', 'Angular', 'Architecture'],
      metric: '1 min 56 → 22 s',
      metricLabel: 'temps de chargement',
      route: '/portfolio/modernisation-nextcity',
      icon: 'trend.png',
    },
    {
      title: 'Kitchen Display',
      subtitle: 'Applications métier · Temps réel · API',
      description: 'Transmission aux cuisines des préparations et cuissons issues des commandes en caisse.',
      categories: ['.NET', 'Architecture'],
      metric: 'Production',
      metricLabel: 'solution déployée et utilisée',
      route: '/portfolio/kitchen-display',
      icon: 'utensils.png',
    },
    {
      title: 'KM Haven - Housekeeping',
      subtitle: 'Applications métier · Temps réel · Angular · API REST',
      description: 'Solution de gestion des équipes d’entretien et de maintenance pour les hôtels et conciergeries, avec suivi des interventions et des stocks.',
      categories: ['.NET', 'Angular', 'Architecture'],
      metric: 'Production',
      metricLabel: 'solution déployée et utilisée',
      route: '/portfolio/km-haven-housekeeping',
      icon: 'kmhaven.png',
    },
    {
      title: 'Gestion des Ateliers de Réseaux Férroviaires',
      subtitle: 'Applications métier · WPF · WCF',
      description: 'Solution de gestion des ateliers de maintenance et de réparation des trains, avec suivi des interventions, des stocks et de la facturation. ',
      categories: ['.NET', 'Architecture'],
      metric: 'Production',
      metricLabel: 'solution déployée et utilisée',
      route: '/portfolio/gestion-des-ateliers-de-reseaux-ferroviaires',
      icon: 'garf.png',
    },
  ];

  readonly visibleProjects = computed(() => {
    const selected = this.selectedCategory();
    return selected === 'Tous'
      ? this.secondaryProjects
      : this.secondaryProjects.filter(project => project.categories.includes(selected));
  });

  selectCategory(category: ProjectCategory): void {
    this.selectedCategory.set(category);
  }
}
