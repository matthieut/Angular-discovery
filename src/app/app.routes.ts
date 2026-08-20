import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PortfolioComponent } from './portfolio-component/portfolio-component';
import { AngularComponent } from './angular-component/angular-component';
import { AngularLab } from './angular-lab/angular-lab';

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent },
    { path: 'lab', component: AngularLab, children: [
      { path: '', pathMatch: 'full', redirectTo: 'fondamentaux/standalone-bootstrap' },
      {
        path: 'fondamentaux/standalone-bootstrap',
        loadComponent: () => import('./angular-lab/standalone-bootstrap-concept/standalone-bootstrap-concept/standalone-bootstrap-concept').then(m => m.StandaloneBootstrapConcept)
      }
    ]},
    { path: 'portfolio', component: PortfolioComponent },
];
