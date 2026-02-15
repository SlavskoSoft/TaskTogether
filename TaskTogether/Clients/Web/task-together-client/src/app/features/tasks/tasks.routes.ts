import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const taskRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent),
      },
    ],
  },
];
