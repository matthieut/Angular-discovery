import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAreaModule } from 'primeng/scrollarea';
import { TRAINING_LESSONS } from '../training.data';
import { TrainingStatus } from '../training.models';
import { TrainingProgressService } from '../training-progress.service';

@Component({ selector: 'app-training-dashboard', standalone: true, imports: [RouterLink, ScrollAreaModule],
  templateUrl: './training-dashboard.html', styleUrl: './training-dashboard.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class TrainingDashboard {
  readonly progress = inject(TrainingProgressService);
  readonly lessons = TRAINING_LESSONS;
  readonly lessonCards = computed(() => this.lessons.map(lesson => ({ lesson, stats: this.progress.statsFor(lesson) })));
  readonly resume = computed(() => { const lesson = this.progress.firstIncompleteLesson(); return { lesson, stats: this.progress.statsFor(lesson) }; });
  readonly mastered = computed(() => this.lessonCards().filter(item => item.stats.status === 'mastered').length);
  readonly consolidate = computed(() => this.lessonCards().filter(item => item.stats.status === 'fragile' || item.stats.status === 'consolidate').length);
  readonly totalQuestions = this.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
  readonly metrics = computed(() => [
    { icon: 'pi pi-file', value: this.lessons.length, label: 'leçons' },
    { icon: 'pi pi-list-check', value: this.totalQuestions, label: 'questions' },
    { icon: 'pi pi-check-circle', value: this.mastered(), label: 'maîtrisées' },
    { icon: 'pi pi-replay', value: this.consolidate(), label: 'à consolider' },
  ]);
  readonly priorities = computed(() => this.lessonCards().filter(item => item.stats.status !== 'mastered')
    .sort((a, b) => a.stats.mastery - b.stats.mastery || b.stats.answered - a.stats.answered).slice(0, 3));

  statusLabel(status: TrainingStatus): string {
    return ({ mastered: 'Maîtrisé', consolidate: 'À consolider', fragile: 'Fragile', unassessed: 'Non évalué' })[status];
  }
}
