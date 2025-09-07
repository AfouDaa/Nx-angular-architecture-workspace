/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { Form, FormMode } from '@org/shared-ui';
import { NgIf } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Repository } from './service';

@Component({
  selector: 'app-demo-form-validate-reactive',
  template: `
    <nz-card>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-control
            [nzSpan]="12"
            nzHasFeedback
            nzValidatingTip="Validating..."
            [nzErrorTip]="userErrorTpl"
          >
            <nz-form-label [nzSpan]="12" nzRequired> test</nz-form-label>
            <input
              nz-input
              formControlName="test"
              placeholder="Please input test Name"
              type="text"
            />
            <ng-template #userErrorTpl let-control>
              @if (control.errors?.['required']) { Please input test! }
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control [nzSpan]="12">
            <button nz-button nzType="primary" [disabled]="!form.valid">
              @if(formMode() === FormModeEnum.Add){
                Save
              }
              @else {
                Edit
              }
s              <ng-template #saveText>Save</ng-template>
            </button>
            <button nz-button (click)="resetForm($event)">Reset</button>
          </nz-form-control>
        </nz-form-item>
      </form> </nz-card
    >
  `,
  imports: [
    NzCardComponent,
    NzColDirective,
    NzFormItemComponent,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSkeletonModule,
    NzInputModule,
    NzButtonModule,
  ],
})
export class FormComponent extends Form<unknown> implements OnInit {
  /** Repository service for CRUD operations */
  _repository = inject(Repository);

  constructor() {
    super();
  }

  /**
   * Lifecycle hook - initializes form
   */
  ngOnInit(): void {
    this.initialize(); // from base class
    this.formMode; // triggers form mode detection
    this.form = this.fb.group({
      test: [null, [Validators.required]], // single required field
    });
  }

  /**
   * Find a record by its ID
   * @param id Record ID
   */
  override findById(id: number | string): Observable<unknown> {
    return this._repository.findById(id).pipe(
      tap((res: unknown) => {
        if (res) {
          // Successfully retrieved record
        } else {
          // Show warning if not found
          this.message.warning(
            this.i18n.fanyi('app.misc.something_went_wrong')
          );
        }
      })
    );
  }

  /**
   * Reset form to its initial state
   * @param e Mouse event from reset button
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.form.reset();
  }

  /**
   * Parse incoming API response and populate form
   * @param model Response object
   */
  override parseIncomingResponse(model: any) {
    console.log(model);
    this.form.patchValue({ ...model.data });
  }

  /**
   * Prepare form data to send to the API
   * @param form Reactive form instance
   */
  override prepareOutgoingRequest(form: any): any {
    return form.value;
  }

  /**
   * Save a new record (Create)
   */
  save() {
    this._repository
      .save(this.prepareOutgoingRequest(this.form))
      .subscribe((res) => {
        if (res) {
          this.message.create('success', 'success');
          this.form.reset();
          setTimeout(() => {
            this.navigate().relatively(['../summary']);
          }, 1000);
        }
      });
  }

  /**
   * Update existing record (Edit)
   */
  update() {
    this._repository
      .update(this.id(), this.prepareOutgoingRequest(this.form))
      .pipe(
        catchError((error: ErrorEvent) => {
          const errorMsg =
            error.error?.message || 'An unexpected error occurred';
          this.message.create('error', errorMsg);
          return of(null); // Prevents observable breaking
        })
      )
      .subscribe((res) => {
        if (res) {
          this.message.create('success', 'Attendance updated');
          this.form.reset();
          setTimeout(() => {
            this.navigate().relatively(['../../summary']);
          }, 1000);
        }
      });
  }

  /**
   * Handle form submission
   * Calls save() for Add mode or update() for Edit mode
   */
  onSubmit() {
    this.formMode() === FormMode.Add ? this.save() : this.update();
  }
}

