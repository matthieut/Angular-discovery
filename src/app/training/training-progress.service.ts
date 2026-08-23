import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TrainingAnswer } from './training.models';

@Injectable({ providedIn: 'root' })
export class TrainingProgressService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'angular-training-progress-v1';
  readonly latestAnswer = signal<TrainingAnswer | null>(this.readLatestAnswer());

  saveAnswer(answer: TrainingAnswer): void {
    this.latestAnswer.set(answer);
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem(this.storageKey, JSON.stringify(answer)); }
    catch { /* La session reste utilisable même si le stockage est indisponible. */ }
  }

  private readLatestAnswer(): TrainingAnswer | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as TrainingAnswer : null;
    } catch { return null; }
  }
}
