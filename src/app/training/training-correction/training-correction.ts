import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';
import { TrainingProgressService } from '../training-progress.service';

@Component({
  selector: 'app-training-correction',
  standalone: true,
  imports: [RouterLink, ScrollAreaModule],
  templateUrl: './training-correction.html',
  styleUrl: './training-correction.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingCorrection {
  private readonly progress = inject(TrainingProgressService);
  readonly answer = this.progress.latestAnswer;
  readonly correct = computed(() => this.answer()?.correct ?? false);
  readonly confidenceLabel = computed(() => ({ low: 'faible', medium: 'moyenne', high: 'élevée' })[this.answer()?.confidence ?? 'medium']);
  readonly codeBefore = `@Component({\n  selector: 'app-user-page',`;
  readonly codeProvider = `  providers: [UserStore]`;
  readonly codeAfter = `})\nexport class UserPage {\n  readonly store = inject(UserStore);\n}`;
}
