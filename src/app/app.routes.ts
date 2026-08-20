import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PortfolioComponent } from './portfolio-component/portfolio-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'lab',
    loadChildren: () =>
      import('./angular-lab/angular-lab.routes').then((routes) => routes.ANGULAR_LAB_ROUTES),
  },
  { path: 'portfolio', component: PortfolioComponent },
];
