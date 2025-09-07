import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  STChange,
  STColumn,
  STComponent,
  STContextmenuFn,
  STContextmenuItem,
  STPage,
  STReq,
  STRes,
} from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, delay, finalize, Observable, of, take } from 'rxjs';
import { NavigationMapping } from '../types';
import { ALAIN_I18N_TOKEN } from '@delon/theme';

/**
 * @undocumented
 */
export enum DownloadOption {
  CSV = 0,
  JSON,
  PDF,
}

/**
 * @undocumented
 */
export interface Criteria {
  index: string;
  title: string;
}

export class Table<T> {
  activatedRoute = inject(ActivatedRoute);

  message = inject(NzMessageService);

  router = inject(Router);

  i18n = inject(ALAIN_I18N_TOKEN);
  isLoading = false;
  tableRef!: STComponent;
  columns: STColumn[] = [];
  criteria: Criteria[] = [];
  displayedCriteria = '~';
  keyword = '';
  noResult: string | TemplateRef<void> = 'No Result Found !!';
  pager: STPage = {
    pageSizes: [5, 10, 20, 50, 100],
    position: 'bottom',
    showSize: true,
    zeroIndexed: true,
  };
  pageIndex = 1;
  pageSize = 5;
  total!: number;
  selectedCriteria = '';
  request: STReq = {
    method: 'GET',
    body: {
      pn: this.pageIndex,
      ps: this.pageSize,
    },
    allInBody: true,
    reName: {
      pi: 'page',
      ps: 'limit',
    },
  };

  response: STRes = {
    process: this.processResponse.bind(this),
  };
  isVeiwOnly = false;
  url = '';

  initialize(): void {
    this.setLoading(true);
    if (this.response.process) {
      setTimeout(() => {
        this.setLoading(false);
      }, 2000);
    }

    this.columns = [
      ...this.getColumns(),
      // {
      //   title: '',
      //   buttons: [
      //     {
      //       iif: () => !this.isVeiwOnly,
      //       icon: 'eye',
      //       click: console.log,
      //     },
      //     {
      //       iif: () => !this.isVeiwOnly,
      //       tooltip: this.i18n.fanyi('app.misc.delete'),
      //       icon: 'delete',
      //       className: 'text-error',
      //       type: 'drawer',
      //       drawer: {
      //         title: this.i18n.fanyi('app.misc.delete'),
      //         component: DeleteDrawerComponent,
      //       },
      //       click: (_record, _modal, comp) => {
      //         this.onDelete(_record, _modal)
      //           .pipe(
      //             take(1),
      //             finalize(() => {
      //               this.setLoading(false);
      //             })
      //           )
      //           .subscribe({
      //             next: () => {
      //               this.message.success(this.i18n.fanyi('app.misc.deleted'));
      //               comp?.reload();
      //             },
      //             error: (err) => {
      //               this.message.error(this.i18n.fanyi(err.error.message));
      //             },
      //           });
      //       },
      //     },
      //     // {
      //     //   icon: 'ellipsis',
      //     //   children: [
      //     //     {
      //     //       type: 'static',
      //     //       icon: 'edit',
      //     //       click: (_record, modal) => {
      //     //       }
      //     //     }
      //     //   ]
      //     // },
      //   ],
      // },
    ];
  }

  contextMenuProvider: STContextmenuFn = (options): STContextmenuItem[] => {
    if (options.type !== 'head') {
      return [
        {
          text: 'Edit',
          fn: (item) => {
            this.navigate().relatively([`../edit/${options.data['_id']}`]);
          },
        },
        {
          text: 'Delete',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          fn: (item) => {},
        },
      ];
    } else {
      return [];
    }
  };

  download(option: DownloadOption): Observable<unknown> {
    return of();
  }

  onDelete(record: any, modal: any): Observable<any> {
    return of({});
  }

  /**
   * Navigate absolutely or relatively
   *
   * @returns {NavigationMapping}
   */
  navigate(): NavigationMapping {
    return {
      absolutely: (url: string): Promise<boolean> =>
        this.router.navigateByUrl(url),
      relatively: (commands: Array<number | string>): Promise<boolean> =>
        this.router.navigate(commands, { relativeTo: this.activatedRoute }),
    };
  }

  /**
   *  implementation of getColumns().
   * @returns {Tabel Colums}
   */

  getColumns(): STColumn[] {
    return [];
  }

  /**
   * Default implementation of response parsing.
   *
   * @param {any[]} data
   * @param {any} rawData
   * @returns {any[]}
   */

  processResponse(data: any[], rawData: any): any[] {
    return [];
  }

  onAdd(): void {
    this.navigate().relatively([`../new`]);
  }

  onKeywordChange(k: string): void {
    this.keyword = k;
  }

  onReset(st: STComponent): void {
    this.tableRef = st;
    st.req.body = {
      pn: this.pageIndex,
      ps: this.pageSize,
      criteria: {},
    };
    st.req.params ={}
    this.keyword = '';
    this.selectedCriteria = '';
    this.displayedCriteria = '~';
    st.reload();
  }

  onSearch(st: STComponent): void {
    st.req.body = {
      pn: this.pageIndex,
      ps: this.pageSize,
    };
    st.req.params ={
      [this.selectedCriteria]: this.keyword,
    }
    st.reload();
  }

  setCriteria(criteria: Criteria): void {
    this.displayedCriteria = criteria.title;
    this.selectedCriteria = criteria.index;
  }

  setLoading(state: boolean): void {
    this.isLoading = state;
  }
}

export * from './ui-component';
