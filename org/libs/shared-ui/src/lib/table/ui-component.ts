import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  TemplateRef,
  ViewChild,
  EventEmitter,
  signal,
  input,
} from '@angular/core';
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
import { NzCardModule } from 'ng-zorro-antd/card';

import { Criteria } from './types';

@Component({
  standalone: true,
  selector: 'lib-ui-table',
  imports: [
    CommonModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    STModule,
    NzCardModule,
  ],
  template: `
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        <li *ngFor="let c of criteria()" nz-menu-item>
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
            <button nz-button>{{ displayedCriteria() }}</button>
            <button nz-button nz-dropdown [nzDropdownMenu]="menu">
              <span nz-icon nzType="ellipsis"></span>
            </button>
          </div>
          <div>
            <input
              nz-input
              (input)="_onKeywordChange($event)"
              [value]="keyword()"
            />
          </div>
          <div>
            <button
              (click)="onSearch(st)"
              class="header-button"
              type="button"
              nz-button
              nzType="primary"
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
              nzType="primary"
            >
              <span nz-icon nzType="reload"></span>
            </button>
          </div>
        </div>
        <div>
          @if(!isVeiwOnly()){
          <button
            (click)="onAddNew()"
            class="header-button"
            type="button"
            nz-button
            nzType="primary"
          >
            <span nz-icon nzType="plus"></span>
          </button>
          }
        </div>
      </div>
    </ng-template>

    <st
      [scroll]="{ x: '1300px', y: '240px' }"
      #st
      [data]="url()"
      [columns]="columns()"
      [contextmenu]="contextMenuProvider()"
      [header]="header"
      [loadingDelay]="500"
      [loading]="loading()"
      [noResult]="noResult()"
      [page]="page()"
      [pi]="pageIndex()"
      [ps]="pageSize()"
      [req]="request()"
      [res]="response()"
      [total]="total()"
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
export class TableUiComponent {
  /** 🔹 Inputs as signals */
  columns = input.required<STColumn[]>();
  contextMenuProvider = input<STContextmenuFn>(() => []);
  criteria = input<Criteria[]>([]);
  displayedCriteria = input<string>('');
  keywordInput = input<string>('');
  keyword = signal<string>(this.keywordInput());
  noResult = input<string | TemplateRef<void>>('');
  page = input.required<STPage>({});
  pageIndex = input<number>(1);
  pageSize = input<number>(10);
  total = input.required<number>();
  loading = input<boolean>(false);
  request = input.required<STReq>({});
  response = input.required<STRes>({});
  url = input.required<string>();
  isVeiwOnly = input<boolean>(false);

  /** Outputs (still EventEmitters for parent components) */
  @Output() addNew = new EventEmitter<void>();
  @Output() ret = new EventEmitter<STChange>();
  @Output() chooseCriteria = new EventEmitter<Criteria>();
  @Output() keywordChange = new EventEmitter<string>();
  @Output() resetEvent = new EventEmitter<STComponent>();
  @Output() searchEvent = new EventEmitter<STComponent>();

  /** ST reference */
  @ViewChild('st', { static: true }) st!: STComponent;

  // 🔹 API
  onChooseCriteria(c: Criteria): void {
    this.chooseCriteria.emit(c);
  }

  _onKeywordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.keyword.set(value)
    this.keywordChange.emit(value);
  }

  onSearch(st: STComponent): void {
    this.searchEvent.emit(st);
  }

  onReset(st: STComponent): void {
    this.resetEvent.emit(st);
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  change(ret: STChange): void {
    this.ret.emit(ret);
  }
}
