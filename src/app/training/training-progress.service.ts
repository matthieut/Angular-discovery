import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TRAINING_LESSONS } from './training.data';
import { LessonStats, MasteryDimension, TrainingAnswer, TrainingLesson, TrainingStatus } from './training.models';

interface StoredProgress { version: 2; answers: readonly TrainingAnswer[]; }

@Injectable({ providedIn: 'root' })
export class TrainingProgressService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'angular-training-progress-v2';
  readonly answers = signal<readonly TrainingAnswer[]>(this.readAnswers());
  readonly totalAnswered = computed(() => this.answers().length);
  readonly totalCorrect = computed(() => this.answers().filter(answer => answer.correct).length);

  saveAnswer(answer: TrainingAnswer): void {
    this.answers.update(current => [...current.filter(item => !(item.conceptId === answer.conceptId && item.questionId === answer.questionId)), answer]);
    this.persist();
  }

  answerFor(conceptId: string, questionId: string): TrainingAnswer | undefined {
    return this.answers().find(answer => answer.conceptId === conceptId && answer.questionId === questionId);
  }

  latestFor(conceptId: string): TrainingAnswer | undefined {
    return [...this.answers()].filter(answer => answer.conceptId === conceptId)
      .sort((a, b) => b.answeredAt.localeCompare(a.answeredAt))[0];
  }

  statsFor(lesson: TrainingLesson): LessonStats {
    const answers = this.answers().filter(answer => answer.conceptId === lesson.id);
    const correct = answers.filter(answer => answer.correct).length;
    const total = lesson.questions.length;
    const progress = total ? Math.round(answers.length / total * 100) : 0;
    const mastery = answers.length ? Math.round(correct / answers.length * 100) : 0;
    return { answered: answers.length, correct, total, progress, mastery, status: this.status(mastery, answers.length, total) };
  }

  dimensionScores(lesson: TrainingLesson): readonly { label: MasteryDimension; value: number }[] {
    const dimensions: readonly MasteryDimension[] = ['Compréhension', 'Lecture de code', 'Mise en pratique', 'Décision'];
    return dimensions.map(label => {
      const ids = lesson.questions.filter(question => question.dimension === label).map(question => question.id);
      const answers = this.answers().filter(answer => answer.conceptId === lesson.id && ids.includes(answer.questionId));
      return { label, value: answers.length ? Math.round(answers.filter(answer => answer.correct).length / answers.length * 100) : 0 };
    });
  }

  firstIncompleteLesson(): TrainingLesson {
    return TRAINING_LESSONS.find(lesson => this.statsFor(lesson).answered < lesson.questions.length) ?? TRAINING_LESSONS[0];
  }

  nextQuestionIndex(lesson: TrainingLesson): number {
    const index = lesson.questions.findIndex(question => !this.answerFor(lesson.id, question.id));
    return index < 0 ? 0 : index;
  }

  resetLesson(conceptId: string): void {
    this.answers.update(answers => answers.filter(answer => answer.conceptId !== conceptId));
    this.persist();
  }

  private status(mastery: number, answered: number, total: number): TrainingStatus {
    if (!answered) return 'unassessed';
    if (answered === total && mastery >= 80) return 'mastered';
    if (mastery >= 60) return 'consolidate';
    return 'fragile';
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem(this.storageKey, JSON.stringify({ version: 2, answers: this.answers() } satisfies StoredProgress)); }
    catch { /* La formation reste utilisable sans stockage persistant. */ }
  }

  private readAnswers(): TrainingAnswer[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const value = JSON.parse(raw) as StoredProgress;
      return value.version === 2 && Array.isArray(value.answers) ? value.answers : [];
    } catch { return []; }
  }
}
