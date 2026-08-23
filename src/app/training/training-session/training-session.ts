import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';
import { findTrainingLesson } from '../training.data';
import { ConfidenceLevel, QuestionType } from '../training.models';
import { TrainingProgressService } from '../training-progress.service';

@Component({
  selector: 'app-training-session', standalone: true, imports: [RouterLink, ScrollAreaModule],
  templateUrl: './training-session.html', styleUrl: './training-session.scss', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingSession {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly progress = inject(TrainingProgressService);
  readonly lesson = findTrainingLesson(this.route.snapshot.paramMap.get('conceptId'));
  readonly questionIndex = this.lesson ? this.progress.nextQuestionIndex(this.lesson) : 0;
  readonly question = this.lesson?.questions[this.questionIndex];
  readonly selectedOption = signal<string | null>(null);
  readonly confidence = signal<ConfidenceLevel | null>(null);
  readonly hintVisible = signal(false);
  readonly lessonStats = computed(() => this.lesson ? this.progress.statsFor(this.lesson) : null);
  readonly mastery = computed(() => this.lesson ? this.progress.dimensionScores(this.lesson) : []);
  readonly questionProgress = this.lesson ? Math.round((this.questionIndex + 1) / this.lesson.questions.length * 100) : 0;

  typeLabel(type: QuestionType): string {
    return ({ quiz: 'Question de compréhension', 'code-diagnostic': 'Diagnostic de code', 'code-completion': 'Code à compléter', architecture: 'Choix d’architecture' })[type];
  }

  selectOption(id: string): void { this.selectedOption.set(id); }
  selectConfidence(level: ConfidenceLevel): void { this.confidence.set(level); }

  validate(): void {
    if (!this.lesson || !this.question) return;
    const optionId = this.selectedOption();
    const confidence = this.confidence();
    if (!optionId || !confidence) return;
    this.progress.saveAnswer({ conceptId: this.lesson.id, questionId: this.question.id, optionId, confidence,
      usedHint: this.hintVisible(), correct: optionId === this.question.correctOptionId, answeredAt: new Date().toISOString() });
    void this.router.navigate(['/formation/correction', this.lesson.id]);
  }
}
