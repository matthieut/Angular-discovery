import { Routes } from '@angular/router';
import { AngularLab } from './angular-lab';

export const ANGULAR_LAB_ROUTES: Routes = [
  {
    path: '',
    component: AngularLab,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'fondamentaux/standalone-bootstrap' },
      {
        path: 'fondamentaux/standalone-bootstrap',
        loadComponent: () =>
          import('./standalone-bootstrap-concept/standalone-bootstrap-concept/standalone-bootstrap-concept').then(
            (m) => m.StandaloneBootstrapConcept,
          ),
      },
      {
        path: 'fondamentaux/composants-templates',
        loadComponent: () =>
          import('./fundamentals/components-templates/components-templates').then(
            (m) => m.ComponentsTemplates,
          ),
      },
      {
        path: 'fondamentaux/data-binding',
        loadComponent: () =>
          import('./fundamentals/data-binding/data-binding').then((m) => m.DataBinding),
      },
      {
        path: 'fondamentaux/directives-pipes',
        loadComponent: () =>
          import('./fundamentals/directives-pipes/directives-pipes').then((m) => m.DirectivesPipes),
      },
      {
        path: 'fondamentaux/injection-dependances',
        loadComponent: () =>
          import('./fundamentals/dependency-injection/dependency-injection').then(
            (m) => m.DependencyInjection,
          ),
      },
      {
        path: 'fondamentaux/cycle-vie-rendu',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'lifecycle-rendering' },
      },
      {
        path: 'fondamentaux/http-intercepteurs',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'http-interceptors' },
      },
      {
        path: 'composants/anatomie-responsabilite',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'component-responsibility' },
      },
      {
        path: 'composants/inputs-outputs-model',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'inputs-outputs-model' },
      },
      {
        path: 'composants/projection-contenu',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'content-projection' },
      },
      {
        path: 'composants/queries-references',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'queries-references' },
      },
      {
        path: 'composants/host-comportements',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'host-behaviors' },
      },
      {
        path: 'composants/smart-presentational',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'smart-presentational' },
      },
      {
        path: 'composants/composants-dynamiques',
        loadComponent: () =>
          import('./shared/lesson-page/lesson-page').then((m) => m.LessonPage),
        data: { lessonId: 'dynamic-components' },
      },
      {
        path: 'reactivite/signals',
        loadComponent: () => import('./reactivity/signals/signals').then((m) => m.Signals),
      },
      {
        path: 'reactivite/computed-effect',
        loadComponent: () =>
          import('./reactivity/computed-effect/computed-effect').then((m) => m.ComputedEffect),
      },
      {
        path: 'reactivite/rxjs-observables',
        loadComponent: () =>
          import('./reactivity/rxjs-observables/rxjs-observables').then((m) => m.RxjsObservables),
      },
      {
        path: 'reactivite/interop-signals-rxjs',
        loadComponent: () =>
          import('./reactivity/interop-signals-rxjs/interop-signals-rxjs').then(
            (m) => m.InteropSignalsRxjs,
          ),
      },
      {
        path: 'donnees-formulaires/http-client',
        loadComponent: () =>
          import('./data-forms/http-client/http-client').then((m) => m.HttpClientConcept),
      },
      {
        path: 'donnees-formulaires/formulaires-reactifs',
        loadComponent: () =>
          import('./data-forms/reactive-forms/reactive-forms').then((m) => m.ReactiveFormsConcept),
      },
      {
        path: 'donnees-formulaires/validation',
        loadComponent: () =>
          import('./data-forms/validation/validation').then((m) => m.ValidationConcept),
      },
      {
        path: 'donnees-formulaires/gestion-erreurs',
        loadComponent: () =>
          import('./data-forms/error-handling/error-handling').then((m) => m.ErrorHandlingConcept),
      },
      {
        path: 'architecture/routing',
        loadComponent: () => import('./architecture/routing/routing').then((m) => m.RoutingConcept),
      },
      {
        path: 'architecture/lazy-loading',
        loadComponent: () =>
          import('./architecture/lazy-loading/lazy-loading').then((m) => m.LazyLoadingConcept),
      },
      {
        path: 'architecture/gestion-etat',
        loadComponent: () =>
          import('./architecture/state-management/state-management').then(
            (m) => m.StateManagementConcept,
          ),
      },
      {
        path: 'architecture/organisation-features',
        loadComponent: () =>
          import('./architecture/feature-organization/feature-organization').then(
            (m) => m.FeatureOrganizationConcept,
          ),
      },
      {
        path: 'qualite-performance/change-detection',
        loadComponent: () =>
          import('./quality-performance/change-detection/change-detection').then(
            (m) => m.ChangeDetectionConcept,
          ),
      },
      {
        path: 'qualite-performance/performance',
        loadComponent: () =>
          import('./quality-performance/performance/performance').then((m) => m.PerformanceConcept),
      },
      {
        path: 'qualite-performance/tests-unitaires',
        loadComponent: () =>
          import('./quality-performance/unit-tests/unit-tests').then((m) => m.UnitTestsConcept),
      },
      {
        path: 'qualite-performance/tests-end-to-end',
        loadComponent: () =>
          import('./quality-performance/e2e-tests/e2e-tests').then((m) => m.E2eTestsConcept),
      },
    ],
  },
];
