import { Component, OnInit, inject } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { Table, TableUiComponent } from '@org/shared-ui';
import { Observable, map } from 'rxjs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Repository } from './service';

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
export class TableComponent extends Table<any> implements OnInit {
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
      { index: 'phone', title: 'Phone', className: 'text-center', width: 100 },
      {
        index: 'occupation',
        title: 'occupation',
        className: 'text-center',
        width: 100,
      },
      {
        index: 'user.email',
        title: 'Email',
        className: 'text-center',
        width: 150,
      },
      {
        index: 'user.roles',
        title: 'Role',
        className: 'text-center',
        width: 100,
      },
      {
        index: 'user.status',
        title: 'Status',
        className: 'text-center',
        width: 100,
      },
      {
        index: 'user.lastLogin',
        title: 'Last Login',
        dateFormat: 'yyyy-MM-dd',
        type: 'date',
        className: 'text-center',
        width: 150,
      },
      {
        index: 'user.createdAt',
        title: 'Created At',
        dateFormat: 'yyyy-MM-dd',
        type: 'date',
        className: 'text-center',
        width: 150,
      },
      {
        index: 'user.updatedAt',
        title: 'Updated At',
        dateFormat: 'yyyy-MM-dd',
        type: 'date',
        className: 'text-center',
        width: 150,
      },
    ];
  }
  override onDelete(record: any): Observable<any> {
    return this._repository.deleteById(record._id);
  }
  override processResponse(_data: any[], rawData: any): any {
    this.total = rawData.total;
    const res = rawData.data;
    return res;
  }
}
