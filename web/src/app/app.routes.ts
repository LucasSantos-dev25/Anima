import { Routes } from '@angular/router';

import { authGuard, guestGuard } from '@core/auth/auth.guards';
import { AppLayout } from '@layouts/app-layout';
import { PublicLayout } from '@layouts/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login-page').then((m) => m.LoginPage),
      },
      {
        path: 'cadastro',
        loadComponent: () => import('@features/auth/register-page').then((m) => m.RegisterPage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  {
    path: 'app',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('@features/profile/profile-page').then((m) => m.ProfilePage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];