import { Component, OnInit, inject } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { Table, TableUiComponent } from '@org/shared-ui';
import { Observable, map } from 'rxjs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Repository } from './service';
import { User } from '@delon/theme';
import { ApiResponse } from '@org/data-access-layer';

@Component({
  selector: 'app-table',
  template: `
    <nz-card>
   <lib-ui-table
    [columns]="columns()"
    [contextMenuProvider]="contextMenuProvider"
    [criteria]="criteria()"
    [displayedCriteria]="displayedCriteria()"
    [keywordInput]="keyword()"
    [noResult]="noResult()"
    [page]="pager"
    [pageIndex]="pageIndex()"
    [pageSize]="pageSize()"
    [request]="request"
    [response]="response"
    [url]="url()"
    [total]="total()"
    [loading]="isLoading()"
    (addNew)="onAdd()"
    (chooseCriteria)="setCriteria($event)"
    (keywordChange)="onKeywordChange($event)"
    (searchEvent)="onSearch($event)"
    (resetEvent)="onReset($event)"
></lib-ui-table>

    </nz-card>
  `,
  standalone: true,
  imports: [TableUiComponent, NzSkeletonModule, NzCardModule],
})
export class TableComponent extends Table<User> implements OnInit {
  _repository = inject(Repository);

  constructor() {
    super();
    this.url.set(this._repository.buildEndpoint());
  }
  ngOnInit(): void {
    this.initialize();
    this.criteria .set([
      { index: 'firstName', title: 'firstName' },
      { index: 'lastName', title: 'lastName' },
      { index: 'hireDate', title: 'hireDate' },
    ])
  }

  override getColumns(): STColumn[] {
    return [
      {
        index: 'firstName',
        title: 'First Name',
        className: 'text-center',
        fixed: 'left',
        width: 100,
      },
      {
        index: 'lastName',
        title: 'Last Name',
        className: 'text-center',
        fixed: 'left',
        width: 100,
      },
      {
        index: 'email',
        title: 'Email',
        width: 150,
      },

      {
        index: 'status',
        title: 'Status',
        className: 'text-center',
        width: 100,
      },

      {
        index: 'createdAt',
        title: 'Created At',
        dateFormat: 'yyyy-MM-dd',
        type: 'date',
        className: 'text-center',
        width: 150,
      },
      {
        index: 'updatedAt',
        title: 'Updated At',
        dateFormat: 'yyyy-MM-dd',
        type: 'date',
        className: 'text-center',
        width: 150,
      },
    ];
  }
  override onDelete(_id: string): Observable<unknown> {
    return this._repository.deleteById(_id);
  }
override processResponse(_data: unknown[], rawData: ApiResponse<User>): User[] {
  this.total.set(rawData.total);
  return rawData.data;
}

}
