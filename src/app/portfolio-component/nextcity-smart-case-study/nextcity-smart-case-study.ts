import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';

interface CaseStudyItem {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-nextcity-smart-case-study',
  standalone: true,
  imports: [RouterLink, ScrollAreaModule],
  templateUrl: './nextcity-smart-case-study.html',
  styleUrl: './nextcity-smart-case-study.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextcitySmartCaseStudy {
  readonly iconPath = '/icons';

  readonly responsibilities: readonly CaseStudyItem[] = [
    {
      title: 'Comprendre et cadrer',
      description: 'Immersion auprès des équipes EQUANS Angers, analyse de leurs pratiques et traduction des besoins en processus métier opérationnels.',
      icon: 'search.png',
    },
    {
      title: 'Architecturer',
      description: 'Conception globale de la solution, de ses connecteurs et de son intégration au système d’information.',
      icon: 'architecture.png',
    },
    {
      title: 'Piloter',
      description: 'Découpage, estimation, priorisation, accompagnement de l’équipe et validation des choix structurants.',
      icon: 'users.png',
    },
    {
      title: 'Développer et sécuriser',
      description: 'Intervention directe sur les sujets complexes, la performance, les échanges et les composants critiques.',
      icon: 'code.png',
    },
  ];

  readonly challenges: readonly CaseStudyItem[] = [
    {
      title: 'Forte volumétrie cartographique',
      description: 'Afficher et manipuler un patrimoine dense tout en conservant une navigation exploitable.',
      icon: 'smartcity.png',
    },
    {
      title: 'Interopérabilité',
      description: 'Faire circuler les données entre SIG, hyperviseur IoT, facturation et API métiers.',
      icon: 'api.png',
    },
    {
      title: 'Continuité opérationnelle',
      description: 'Soutenir des activités de maintenance, de supervision et d’astreinte dans un contexte exigeant.',
      icon: 'shield.png',
    },
    {
      title: 'Processus métier adaptés au terrain',
      description: 'Observer les méthodes de travail sur site, identifier les points de friction, puis coconstruire et déployer les processus les plus adaptés aux contraintes des équipes EQUANS Angers.',
      icon: 'users.png',
    },
  ];

  readonly stack = ['Angular', '.NET / .NET Core', 'Web API & WCF', 'SQL Server', 'WPF', 'REST', 'JWT / OAuth', 'SIG & IoT'];
}
