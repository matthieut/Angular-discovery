import { Component } from "@angular/core";

interface Experience {
  period: string;
  company: string;
  role: string;
  details: string[];
}

interface Skill {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  readonly iconPath = '';

  readonly experiences: Experience[] = [
    {
      period: '2019 — 2025',
      company: 'Effect Software',
      role: 'Architecte logiciel / Tech Lead — Chef de projet',
      details: [
        'Responsabilité technique de NextCity : 100+ collectivités, 1 200+ utilisateurs et 1,2 M+ d’équipements.',
        'Responsable de la migration progressive de NextCity vers Angular, RxJS et .NET Core.',
        'Pilotage technique de 7 développeurs.',
        'Prise en charge des évolutions, du besoin métier jusqu’à la livraison.',
        'Développement hands-on sur les sujets complexes et structurants.',
      ],
    },
    {
      period: '2015 — 2019',
      company: 'Agapes Services',
      role: 'Ingénieur de développement — évolution vers conception / architecture',
      details: [
        'Développement d’applications métier, dont Kitchen Display.',
        'Développement d’applications Web et mise en place d’API.',
        'Participation croissante à l’architecture, à la conception et aux échanges métier.',
      ],
    },
    {
      period: '2013 — 2015',
      company: 'Effect Software',
      role: 'Alternance puis ingénieur de développement',
      details: [
        'Participation à la création de NextCity à partir de zéro.',
        'Développement du socle historique en C#/.NET, WPF, WCF et SQL Server.',
      ],
    },
  ];

  readonly skills: Skill[] = [
    { label: '.NET / C#', icon: 'dotnet.png' },
    { label: 'Angular', icon: 'angular.png' },
    { label: 'Architecture logicielle', icon: 'architecture.png' },
    { label: 'SQL Server', icon: 'database.png' },
    { label: 'API REST', icon: 'api.png' },
    { label: 'Azure DevOps', icon: 'devops.png' },
  ];

  trackByCompany = (_: number, experience: Experience) => `${experience.company}-${experience.period}`;
  trackBySkill = (_: number, skill: Skill) => skill.label;
}