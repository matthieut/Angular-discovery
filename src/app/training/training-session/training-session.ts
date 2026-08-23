import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfidenceLevel } from '../training.models';
import { TrainingProgressService } from '../training-progress.service';

interface AnswerOption { id: string; label: string; detail: string; }

@Component({
  selector: 'app-training-session',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './training-session.html',
  styleUrl: './training-session.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingSession {
  private readonly router = inject(Router);
  private readonly progress = inject(TrainingProgressService);
  readonly selectedOption = signal<string | null>(null);
  readonly confidence = signal<ConfidenceLevel | null>(null);
  readonly hintVisible = signal(false);
  readonly code = `@Component({
  selector: 'app-user-page',
  providers: [UserStore]
})
export class UserPage {
  readonly store = inject(UserStore);
}`;
  readonly options: readonly AnswerOption[] = [
    { id: 'none', label: 'Aucune instance', detail: 'Le provider ne serait jamais résolu.' },
    { id: 'single', label: 'Une instance globale', detail: 'Une instance pour toute l’application.' },
    { id: 'component', label: 'Une instance par composant', detail: 'Autant d’instances que de UserPage.' },
    { id: 'injection', label: 'Une instance par injection', detail: 'Autant d’instances que d’appels à inject().' },
  ];

  selectOption(id: string): void { this.selectedOption.set(id); }
  selectConfidence(level: ConfidenceLevel): void { this.confidence.set(level); }

  validate(): void {
    const optionId = this.selectedOption();
    const confidence = this.confidence();
    if (!optionId || !confidence) return;
    this.progress.saveAnswer({
      conceptId: 'injection-dependances', optionId, confidence,
      correct: optionId === 'component', answeredAt: new Date().toISOString(),
    });
    void this.router.navigate(['/formation/correction/injection-dependances']);
  }
}
