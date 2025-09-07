/* eslint-disable @typescript-eslint/no-unused-vars */
import { TemplateRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  STColumn,
  STComponent,
  STContextmenuFn,
  STContextmenuItem,
  STPage,
  STReq,
  STRes,
} from '@delon/abc/st';
import { Observable, of } from 'rxjs';
import { NavigationMapping } from './types';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { Criteria, DownloadOption } from './types';

/**
 * Generic Table abstraction with reactive state management using Angular signals.
 * Provides built-in support for:
 * - Pagination
 * - Search & filter criteria
 * - Context menu
 * - Navigation helpers
 * - Data response processing
 *
 * @template T - The type of table records
 * @author Ahmed Fouda
 */
export class Table<T> {
  /** Angular Router helpers */
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  /** Internationalization provider */
  i18n = inject(ALAIN_I18N_TOKEN);

  /** Reactive state signals */
  isLoading = signal<boolean>(false);
  displayedCriteria = signal<string>('~');
  keyword = signal<string>('-');
  noResult = signal<string | TemplateRef<void>>('No Result Found !!');
  pageIndex = signal<number>(1);
  pageSize = signal<number>(5);
  total = signal<number>(0);
  selectedCriteria = signal<string>('');
  isVeiwOnly = signal<boolean>(false);
  url = signal<string>('');

  /** Table reference & configuration */
  tableRef!: STComponent;
  columns =signal< STColumn[]>([]);
  criteria=signal< Criteria[]>([]);

  /** Pager configuration */
  pager: STPage = {
    pageSizes: [5, 10, 20, 50, 100],
    position: 'bottom',
    showSize: true,
    zeroIndexed: true,
  };

  /** Request configuration */
  request: STReq = {
    method: 'GET',
    body: {
      pn: this.pageIndex(),
      ps: this.pageSize(),
    },
    allInBody: true,
    reName: {
      pi: 'page',
      ps: 'limit',
    },
  };

  /** Response handler */
  response: STRes = {
    process: this.processResponse.bind(this),
  };

  /**
   * Initializes the table with default columns and loading state.
   */
  initialize(): void {
    this.isLoading.set(true);
    if (this.response.process) {
      setTimeout(() => {
        this.isLoading.set(false);
      }, 2000);
    }
  // merge existing columns with new ones
  this.columns.update(cols => [...cols, ...this.getColumns()]);
  }

  /**
   * Context menu provider for table rows.
   */
  contextMenuProvider: STContextmenuFn = (
    options,
  ): STContextmenuItem[] => {
    if (options.type !== 'head') {
      return [
        {
          text: 'Edit',
          fn: () => {
            this.navigate().relatively([`../edit/${options.data['_id']}`]);
          },
        },
        {
          text: 'Delete',
          fn: () => {
            /* empty */
          },
        },
      ];
    }
    return [];
  };

  /**
   * Downloads table data in the given format.
   * @param option Format option (CSV, JSON, PDF)
   */
  download(option: DownloadOption): Observable<unknown> {
    return of();
  }

  /**
   * Handles record deletion.
   */
  onDelete(record: unknown, modal: unknown): Observable<unknown> {
    return of({});
  }

  /**
   * Navigate absolutely or relatively.
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
   * Override to define table columns.
   */
  getColumns(): STColumn[] {
    return [];
  }

  /**
   * Default implementation of response parsing.
   * @param _data Data array
   * @param _rawData Raw response
   */
  processResponse(_data: unknown[], _rawData: unknown): unknown[] {
    return [];
  }

  /**
   * Trigger navigation to add new record form.
   */
  onAdd(): void {
    this.navigate().relatively([`../new`]);
  }

  /**
   * Update the search keyword.
   */
  onKeywordChange(k: string): void {
    this.keyword.set(k);
  }

  /**
   * Reset search and filters.
   */
  onReset(st: STComponent): void {
    this.tableRef = st;
    st.req.body = {
      pn: this.pageIndex,
      ps: this.pageSize,
      criteria: {},
    };
    st.req.params = {};
    this.keyword.set('');
    this.selectedCriteria.set('');
    this.displayedCriteria.set('');
    st.reload();
  }

  /**
   * Perform a search with the current keyword and selected criteria.
   */
  onSearch(st: STComponent): void {
    st.req.body = {
      pn: this.pageIndex,
      ps: this.pageSize,
    };
    st.req.params = {
      [this.selectedCriteria()]: this.keyword(),
    };
    st.reload();
  }

  /**
   * Set the currently selected search criteria.
   */
  setCriteria(criteria: Criteria): void {
    this.displayedCriteria.set(criteria.title);
    this.selectedCriteria.set(criteria.index);
  }
}
