/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';
import { AppLoginComponent } from './features/login';
import {startPageGuard} from '@org/core'
import { LayoutComponent } from './features/layout';
export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('@org/demo').then(
            (m) => m.Module
          ),
      },

      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },

  {
    path: 'login',
    component: AppLoginComponent,
    data: { title: 'login', titleI18n: 'app.login.login' },
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }, // optional catch-all
];
