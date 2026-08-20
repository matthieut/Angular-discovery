import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PortfolioComponent } from './portfolio-component/portfolio-component';
import { AngularComponent } from './angular-component/angular-component';

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent },
    { path: 'angular', component: AngularComponent },
    { path: 'portfolio', component: PortfolioComponent },
];
