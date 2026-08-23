import { Routes } from '@angular/router';

export const TRAINING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./training-dashboard/training-dashboard').then(m => m.TrainingDashboard),
  },
  {
    path: 'session/:conceptId',
    loadComponent: () => import('./training-session/training-session').then(m => m.TrainingSession),
  },
  {
    path: 'correction/:conceptId',
    loadComponent: () => import('./training-correction/training-correction').then(m => m.TrainingCorrection),
  },
];
