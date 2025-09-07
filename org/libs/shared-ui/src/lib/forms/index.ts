import { inject } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, combineLatest, concat, iif, of } from 'rxjs';
import { delay, finalize, take, tap } from 'rxjs/operators';
import { NavigationMapping } from '../types';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
/**
 * Enumeration for form modes.
 */
export enum FormMode {
  Add,
  Edit,
}

export class Form<T> {
  i18n = inject(ALAIN_I18N_TOKEN);

  activatedRoute = inject(ActivatedRoute);

  form: UntypedFormGroup = new UntypedFormGroup({});

  formMode: FormMode = FormMode.Add;

  isLoading = false;

  message = inject(NzMessageService);

  router = inject(Router);

  useServerForm = false;

  _FormBuilder = inject(FormBuilder);

  id!: any;
  /**
   * Must be overridden to implement the logic of finding an entity by the given ID.
   *
   * @param {number|string} _id
   * @returns {Observable<T>}
   */
  findById(_id: number | string): Observable<T> {
    return of({} as T);
  }

  /**
   * Generate a static form schema.
   *
   * @returns {FormlyFieldConfig[]}
   */

  /**
   * Initializes the form.
   * - Sets loading state
   * - Retrieves form fields and data based on the form mode
   */
  initialize(): void {
    this.setLoading(true);
    const data$ = combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
    ]).pipe(
      delay(1000),
      take(1),
      tap(([params, queryParams]) => {
        this.setFormMode(FormMode.Add);
        if (params['id']) {
          this.setFormMode(FormMode.Edit);
          this.findById(params['id'])
            .pipe(
              take(1),
              tap((model: T) => {
                this.parseIncomingResponse(model);
                 this.setLoading(false);

              }),
              finalize(() => {
                this.setLoading(false);
              })
            )
            .subscribe();
        } else {
          this.setLoading(false);
          this.setFormMode(FormMode.Add);
        }
      })
    );

    concat(data$).subscribe();
  }

  /**
   * Navigate to a specified URL or relative route.
   *
   * @returns {NavigationMapping} Object with navigation methods
   */
  navigate(): NavigationMapping {
    return {
      absolutely: (url: string): Promise<boolean> =>
        this.router.navigateByUrl(url),
      relatively: (commands: Array<number | string>): Promise<boolean> =>
        this.router.navigate(commands, { relativeTo: this.activatedRoute }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getCopiedData() {}
  /**
   * Parse and modify the server response of a single entity.
   *
   * @param {R} _response
   * @returns {T}
   * @method post
   */
  parseIncomingResponse<R>(_response: R): T {
    return {} as T;
  }

  /**
   * Prepares the entity to be sent to the server.
   *
   * @param {T} _model
   * @returns {R}
   * @method Edit

   */
  prepareOutgoingRequest<R>(_model: T): R {
    return {} as R;
  }

  /**
   * Set the form mode.
   *
   * @param {FormMode} formMode
   */
  setFormMode(formMode: FormMode): void {
    this.formMode = formMode;
  }

  /**
   * Set the loading state of the form.
   *
   * @param {boolean} state
   */
  setLoading(state: boolean): void {
    this.isLoading = state;
  }

  isFormInvalid(): boolean {
    return this.form.invalid || this.form.pending;

    // return this.form.invalid || this.form.pending;
  }
}
