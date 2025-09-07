import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  STChange,
  STColumn,
  STComponent,
  STContextmenuFn,
  STModule,
  STPage,
  STReq,
  STRes,
} from '@delon/abc/st';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { Criteria } from './';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    STModule,
    NzCardModule,
  ],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sb-ui-table',
  template: `
<nz-dropdown-menu #menu="nzDropdownMenu">
  <ul nz-menu>
    <li *ngFor="let c of criteria" nz-menu-item>
      <button type="button" (click)="onChooseCriteria(c)">
        {{ c.title }}
      </button>
    </li>
  </ul>
</nz-dropdown-menu>

    <ng-template #header>
      <div class="header-tools-wrapper">
        <div class="search-criteria-wrapper">
          <div>
            <button nz-button>{{ displayedCriteria }}</button>
            <button nz-button nz-dropdown [nzDropdownMenu]="menu">
              <span nz-icon nzType="ellipsis"></span>
            </button>
          </div>
          <div>
            <input nz-input (input)="_onKeywordChange($event)" name="keyword" [value]="keyword" />
          </div>
          <div>
            <button
              (click)="onSearch(st)"
              class="header-button"
              type="button"
              nz-button
              [nzType]="'primary'"
            >
              <span nz-icon nzType="search"></span>
            </button>
          </div>
          <div>
            <button
              (click)="onReset(st)"
              class="header-button"
              type="button"
              nz-button
              [nzType]="'primary'"
            >
              <span nz-icon nzType="reload"></span>
            </button>
          </div>
        </div>
        <div>
          @if(!isVeiwOnly){
          <div>
            <button
              (click)="onAddNew()"
              class="header-button"
              type="button"
              nz-button
              [nzType]="'primary'"
            >
              <span nz-icon nzType="plus"></span>
            </button>
          </div>

          }
        </div>
      </div>
    </ng-template>

    <st
     [scroll]="{ x: '1300px', y: '240px' }"

      #st
      [data]="url"
      [columns]="columns"
      [contextmenu]="contextMenuProvider"
      [header]="header"
      [loadingDelay]="500"
      [loading]="loading"
      [noResult]="noResult"
      [page]="page"
      [pi]="pageIndex"
      [ps]="pageSize"
      [req]="request"
      [res]="response"
      [total]="total"
      size="middle"
      (change)="change($event)"
    ></st>
  `,
  styles: [
    `
      .header-tools-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .search-criteria-wrapper {
        display: flex;
        gap: 1rem;
      }

      .header-button {
        width: 64px;
      }
    `,
  ],
  exportAs: 'fsiTable',
})
export class TableComponent {
  @Input() columns: STColumn[] = [];
  @Input() contextMenuProvider!: STContextmenuFn;
  @Input() criteria: Criteria[] = [];
  @Input() displayedCriteria = '';
  @Input() keyword = '';
  @Input() noResult: string | TemplateRef<void> = ' ';
  @Input() page: STPage = {};
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Input() loading!: boolean;
  @Input() request: STReq = {};
  @Input() response: STRes = {};
  @Input() url = '';
  @Input() isVeiwOnly = false;

  @Output() @ViewChild('st', { static: true }) st!: STComponent;

  @Output()
  addNew: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  ret: EventEmitter<STChange> = new EventEmitter<STChange>();

  @Output()
  chooseCriteria: EventEmitter<Criteria> = new EventEmitter<Criteria>();

  @Output()
  keywordChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  search: EventEmitter<STComponent> = new EventEmitter<STComponent>();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  reset: EventEmitter<STComponent> = new EventEmitter<STComponent>();

  onChooseCriteria(c: Criteria): void {
    this.chooseCriteria.emit(c);
  }

  _onKeywordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.keyword = value;
    this.keywordChange.emit(value);
  }

  onSearch(st: STComponent): void {
    this.search.emit(st);
  }

  onReset(st: STComponent): void {
    this.reset.emit(st);
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  change(ret: STChange) {
    this.ret.emit(ret);
  }
}
