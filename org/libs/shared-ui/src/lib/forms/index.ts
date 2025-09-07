/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, combineLatest, concat } from 'rxjs';
import { delay, finalize, take, tap } from 'rxjs/operators';
import { ALAIN_I18N_TOKEN } from '@delon/theme';

/**
 * Defines whether the form is in Add or Edit mode
 */
export enum FormMode {
  Add = 'Add',
  Edit = 'Edit',
}

/**
 * Navigation mapping utilities for easier router calls.
 */
export interface NavigationMapping {
  absolutely: (url: string) => Promise<boolean>;
  relatively: (commands: Array<number | string>) => Promise<boolean>;
}

/**
 * 🔹 Base Form class with signals, router navigation, and reactive form utilities.
 * Extend this class in feature components to build Add/Edit forms consistently.
 */
export class Form<T> {
  /** Internationalization service (Delon i18n) */
  public i18n = inject(ALAIN_I18N_TOKEN);

  /** Notification service from Ng-Zorro */
  public message = inject(NzMessageService);

  /** Angular reactive forms builder */
  public fb = inject(FormBuilder);

  /** Router utilities */
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  /** Reactive form instance (must be overridden in extending classes) */
  form = new UntypedFormGroup({});

  // ✅ State management using Angular Signals
  /** Current form mode (Add/Edit) */
  formMode = signal<FormMode>(FormMode.Add);

  /** Expose enum for templates */
  FormModeEnum = FormMode;

  /** Whether API call or initialization is running */
  isLoading = signal<boolean>(false);

  /** Whether to rely on server-driven form definitions */
  useServerForm = signal<boolean>(false);

  /** Current entity ID (from route params if editing) */
  id = signal<string>('null');

  /** Computed signal: true if form is invalid or still validating */
  isFormInvalid = computed(() => this.form.invalid || this.form.pending);

  constructor() {
    // Run an effect whenever formMode changes
    effect(() => {
      console.log('Form mode changed →', this.formMode());
    });
  }

  /**
   * Must be overridden in subclasses:
   * Fetch entity by ID from API/backend.
   * @param _id Entity ID
   * @returns Observable of entity type T
   */
  findById(_id: number | string): Observable<T> {
    return of({} as T);
  }

  /**
   * Initializes the form: checks route params,
   * sets mode to Add or Edit, fetches entity if needed.
   */
  initialize(): void {
    this.setLoading(true);

    const data$ = combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
    ]).pipe(
      delay(1000), // artificial delay (can be removed in prod)
      take(1),
      tap(([params]) => {
        if (params['id']) {
          // Edit mode → fetch entity
          this.id.set(params['id']);
          this.formMode.set(FormMode.Edit);

          this.findById(params['id'])
            .pipe(
              take(1),
              tap((model: T) => {
                this.parseIncomingResponse(model);
                this.setLoading(false);
              }),
              finalize(() => this.setLoading(false))
            )
            .subscribe();
        } else {
          // Add mode → just set form ready
          this.setLoading(false);
          this.formMode.set(FormMode.Add);
        }
      })
    );

    concat(data$).subscribe();
  }

  /**
   * Router navigation helpers
   * @returns mapping for absolute or relative navigation
   */
  navigate(): NavigationMapping {
    return {
      absolutely: (url: string) => this.router.navigateByUrl(url),
      relatively: (commands: Array<number | string>) =>
        this.router.navigate(commands, { relativeTo: this.activatedRoute }),
    };
  }

  /**
   * Placeholder for copying data between entities (override in child class if needed)
   */
  getCopiedData() {
    /* empty */
  }

  /**
   * Parse API response and populate form
   * Override in subclasses for custom mapping
   * @param _response Backend response
   */
  parseIncomingResponse<R>(_response: R): T {
    return {} as T;
  }

  /**
   * Prepare form values to send to backend
   * Override in subclasses for custom mapping
   * @param _model Current form model
   */
  prepareOutgoingRequest<R>(_model: T): R {
    return {} as R;
  }

  /**
   * Update form mode manually
   * @param formMode Add | Edit
   */
  setFormMode(formMode: FormMode): void {
    this.formMode.set(formMode);
  }

  /**
   * Update loading state
   * @param state true = loading, false = idle
   */
  setLoading(state: boolean): void {
    this.isLoading.set(state);
  }
}
