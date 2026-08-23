import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';
import { findTrainingLesson } from '../training.data';
import { TrainingProgressService } from '../training-progress.service';

@Component({ selector: 'app-training-correction', standalone: true, imports: [RouterLink, ScrollAreaModule],
  templateUrl: './training-correction.html', styleUrl: './training-correction.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class TrainingCorrection {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly progress = inject(TrainingProgressService);
  readonly lesson = findTrainingLesson(this.route.snapshot.paramMap.get('conceptId'));
  readonly answer = this.lesson ? this.progress.latestFor(this.lesson.id) : undefined;
  readonly question = this.lesson?.questions.find(question => question.id === this.answer?.questionId);
  readonly selectedOption = this.question?.options.find(option => option.id === this.answer?.optionId);
  readonly correctOption = this.question?.options.find(option => option.id === this.question?.correctOptionId);
  readonly correct = computed(() => this.answer?.correct ?? false);
  readonly confidenceLabel = computed(() => ({ low: 'faible', medium: 'moyenne', high: 'élevée' })[this.answer?.confidence ?? 'medium']);
  readonly stats = computed(() => this.lesson ? this.progress.statsFor(this.lesson) : null);
  readonly complete = computed(() => this.stats()?.answered === this.stats()?.total);

  continue(): void {
    if (!this.lesson) return;
    void this.router.navigate(this.complete() ? ['/formation'] : ['/formation/session', this.lesson.id]);
  }
}
