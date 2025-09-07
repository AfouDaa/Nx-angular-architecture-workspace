import { Route } from '@angular/router';

export const appRoutes: Route[] = [

      {
        path: 'users',
        loadChildren: () =>
          // eslint-disable-next-line @nx/enforce-module-boundaries
          import('apps/fdd-app/src/app/features/demo/module').then(
            (m) => m.Module
          ),
      },

];
