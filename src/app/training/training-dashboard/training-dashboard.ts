import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRAINING_PATHS, TRAINING_PRIORITIES } from '../training.data';
import { TrainingStatus } from '../training.models';
import { ScrollAreaModule } from 'primeng/scrollarea';

@Component({
  selector: 'app-training-dashboard',
  standalone: true,
  imports: [RouterLink, ScrollAreaModule],
  templateUrl: './training-dashboard.html',
  styleUrl: './training-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingDashboard {
  readonly paths = TRAINING_PATHS;
  readonly priorities = TRAINING_PRIORITIES;
  readonly metrics = [
    { icon: 'pi pi-file', value: '76', label: 'fiches' },
    { icon: 'pi pi-check-circle', value: '18', label: 'maîtrisées' },
    { icon: 'pi pi-circle-fill', value: '12', label: 'à consolider' },
    { icon: 'pi pi-replay', value: '4', label: 'révisions' },
  ] as const;

  statusLabel(status: TrainingStatus): string {
    return ({ mastered: 'Maîtrisé', consolidate: 'À consolider', fragile: 'Fragile', unassessed: 'Non évalué' })[status];
  }
}
