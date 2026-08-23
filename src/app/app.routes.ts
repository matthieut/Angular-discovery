import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PortfolioComponent } from './portfolio-component/portfolio-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home-page/home-page').then(component => component.HomePage),
    data: { seo: { title: 'Matthieu Talleu — Chef de projet, architecte logiciel .NET & Angular', description: 'Portfolio de Matthieu Talleu : 12 ans d’expérience en développement .NET, Angular, architecture logicielle, pilotage technique et applications métier complexes.' } },
  },
  { path: 'cv', component: HomeComponent, data: { seo: { title: 'CV — Matthieu Talleu | .NET, Angular et architecture logicielle', description: 'Découvrez le parcours, les compétences et les réalisations de Matthieu Talleu, chef de projet et architecte logiciel spécialisé en .NET et Angular.' } } },
  {
    path: 'lab',
    loadChildren: () =>
      import('./angular-lab/angular-lab.routes').then((routes) => routes.ANGULAR_LAB_ROUTES),
    data: { seo: { title: 'Angular Lab — Concepts, exemples et bonnes pratiques', description: 'Un laboratoire pédagogique pour comprendre Angular, mettre ses concepts en pratique et comparer les approches adaptées à chaque contexte.' } },
  },
  {
    path: 'formation',
    loadChildren: () =>
      import('./training/training.routes').then((routes) => routes.TRAINING_ROUTES),
    data: { seo: { title: 'Formation Angular — Évaluer et consolider ses connaissances', description: 'Un parcours de formation Angular fondé sur des évaluations, des corrections détaillées et des exercices pratiques.' } },
  },
  {
    path: 'portfolio/nextcity-smart',
    loadComponent: () =>
      import('./portfolio-component/nextcity-smart-case-study/nextcity-smart-case-study').then(
        (component) => component.NextcitySmartCaseStudy,
      ),
    data: { seo: { title: 'NextCity SMART — Étude de cas Smart City à Angers', description: 'Étude de cas NextCity SMART : pilotage, processus métier, interopérabilité, cartographie et performance pour Angers Loire Métropole et EQUANS.' } },
  },
  { path: 'portfolio', component: PortfolioComponent, data: { seo: { title: 'Portfolio — Applications métier .NET et Angular', description: 'Projets et études de cas de Matthieu Talleu autour des applications métier, de la Smart City, de la maintenance et de la restauration.' } } },
];
