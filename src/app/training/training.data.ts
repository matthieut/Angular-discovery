import { TrainingPath, TrainingPriority } from './training.models';

export const TRAINING_PATHS: readonly TrainingPath[] = [
  { id: 'fundamentals', title: 'Fondamentaux', icon: 'pi pi-box', progress: 68, completed: 4, total: 7 },
  { id: 'components', title: 'Composants', icon: 'pi pi-th-large', progress: 42, completed: 2, total: 7 },
  { id: 'signals', title: 'Signals', icon: 'pi pi-bolt', progress: 25, completed: 1, total: 6 },
  { id: 'rxjs', title: 'RxJS', icon: 'pi pi-sync', progress: 14, completed: 1, total: 7 },
  { id: 'forms', title: 'Formulaires', icon: 'pi pi-list', progress: 8, completed: 0, total: 7 },
  { id: 'routing', title: 'Routing', icon: 'pi pi-share-alt', progress: 0, completed: 0, total: 8 },
];

export const TRAINING_PRIORITIES: readonly TrainingPriority[] = [
  { title: 'Providers et hiérarchie d’injection', status: 'fragile', route: '/formation/session/injection-dependances' },
  { title: 'computed ou effect ?', status: 'consolidate', route: '/formation/session/computed-effect' },
  { title: 'switchMap et concurrence', status: 'unassessed', route: '/formation/session/rxjs-concurrency' },
];
