import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PortfolioComponent } from './portfolio-component/portfolio-component';
import { AngularComponent } from './angular-component/angular-component';
import { AngularLab } from './angular-lab/angular-lab';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'lab',
    component: AngularLab,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'fondamentaux/standalone-bootstrap' },
      {
        path: 'fondamentaux/standalone-bootstrap',
        loadComponent: () =>
          import('./angular-lab/standalone-bootstrap-concept/standalone-bootstrap-concept/standalone-bootstrap-concept').then(
            (m) => m.StandaloneBootstrapConcept,
          ),
      },
      {
        path: 'fondamentaux/composants-templates',
        loadComponent: () =>
          import('./angular-lab/fundamentals/components-templates/components-templates').then(
            (m) => m.ComponentsTemplates,
          ),
      },
      {
        path: 'fondamentaux/data-binding',
        loadComponent: () =>
          import('./angular-lab/fundamentals/data-binding/data-binding').then((m) => m.DataBinding),
      },
      {
        path: 'fondamentaux/directives-pipes',
        loadComponent: () =>
          import('./angular-lab/fundamentals/directives-pipes/directives-pipes').then(
            (m) => m.DirectivesPipes,
          ),
      },
      {
        path: 'fondamentaux/injection-dependances',
        loadComponent: () =>
          import('./angular-lab/fundamentals/dependency-injection/dependency-injection').then(
            (m) => m.DependencyInjection,
          ),
      },
      {
        path: 'reactivite/signals',
        loadComponent: () =>
          import('./angular-lab/reactivity/signals/signals').then((m) => m.Signals),
      },
      {
        path: 'reactivite/computed-effect',
        loadComponent: () =>
          import('./angular-lab/reactivity/computed-effect/computed-effect').then(
            (m) => m.ComputedEffect,
          ),
      },
      {
        path: 'reactivite/rxjs-observables',
        loadComponent: () =>
          import('./angular-lab/reactivity/rxjs-observables/rxjs-observables').then(
            (m) => m.RxjsObservables,
          ),
      },
      {
        path: 'reactivite/interop-signals-rxjs',
        loadComponent: () =>
          import('./angular-lab/reactivity/interop-signals-rxjs/interop-signals-rxjs').then(
            (m) => m.InteropSignalsRxjs,
          ),
      },
    ],
  },
  { path: 'portfolio', component: PortfolioComponent },
];
