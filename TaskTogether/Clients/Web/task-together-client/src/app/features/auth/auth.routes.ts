import { Routes } from '@angular/router';
import { notAuthGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        canActivate: [notAuthGuard],
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [notAuthGuard],
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
];
