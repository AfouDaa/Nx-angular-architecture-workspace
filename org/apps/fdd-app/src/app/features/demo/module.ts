import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from './page';
import { TableComponent } from './table';
import { FormComponent } from './form';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PageComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'summary',
          },
          {
            path: 'new',
            component: FormComponent,
          },
          {
            path: 'edit/:id',
            component: FormComponent,
          },
          {
            path: 'summary',
            component: TableComponent,
          },
        ],
      },
    ]),
  ],
  exports: [],
  declarations: [],
  providers: [],
})
export class Module {}
