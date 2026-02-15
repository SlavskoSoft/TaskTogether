import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { taskRoutes } from './features/tasks/tasks.routes';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'auth', children: authRoutes },
  { path: 'dashboard', children: dashboardRoutes },
  { path: 'tasks', children: taskRoutes },
  { path: '**', redirectTo: '/' },
];
