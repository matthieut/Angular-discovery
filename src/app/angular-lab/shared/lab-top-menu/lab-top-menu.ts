import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface LabMenuItem {
  label: string;
  shortLabel: string;
  icon: string;
  route: string;
  count: number;
}

@Component({
  selector: 'app-lab-top-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './lab-top-menu.html',
  styleUrl: './lab-top-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabTopMenu {
  readonly iconPath = '/icons/lab';
  readonly items: readonly LabMenuItem[] = [
    { label: 'Fondamentaux', shortLabel: 'Bases', icon: 'angular.png', route: '/lab/fondamentaux/standalone-bootstrap', count: 7 },
    { label: 'Composants', shortLabel: 'Composants', icon: 'cube.png', route: '/lab/composants/anatomie-responsabilite', count: 7 },
    { label: 'Réactivité', shortLabel: 'Réactivité', icon: 'trend.png', route: '/lab/reactivite/signals', count: 4 },
    { label: 'Données et formulaires', shortLabel: 'Données', icon: 'database.png', route: '/lab/donnees-formulaires/http-client', count: 4 },
    { label: 'Architecture', shortLabel: 'Architecture', icon: 'architecture.png', route: '/lab/architecture/routing', count: 4 },
    { label: 'Qualité et performance', shortLabel: 'Qualité', icon: 'rocket.png', route: '/lab/qualite-performance/change-detection', count: 4 },
  ];
}
