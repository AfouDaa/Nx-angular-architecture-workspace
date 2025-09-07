/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Repository } from './service';
import { User } from './types';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-form',
  template: `
    <nz-card>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>First Name</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="firstNameErrorTpl">
            <input
              nz-input
              formControlName="firstName"
              placeholder="Enter first name"
            />
            <ng-template #firstNameErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >First name is required!</ng-container
              >
              <ng-container *ngIf="control.errors?.['minlength']"
                >Min 2 characters</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Last Name</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="lastNameErrorTpl">
            <input
              nz-input
              formControlName="lastName"
              placeholder="Enter last name"
            />
            <ng-template #lastNameErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >Last name is required!</ng-container
              >
              <ng-container *ngIf="control.errors?.['minlength']"
                >Min 2 characters</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Email</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="emailErrorTpl">
            <input
              nz-input
              formControlName="email"
              placeholder="Enter email"
              type="email"
            />
            <ng-template #emailErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >Email is required!</ng-container
              >
              <ng-container *ngIf="control.errors?.['email']"
                >Enter a valid email!</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Password</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="passwordErrorTpl">
            <input
              nz-input
              formControlName="password"
              placeholder="Enter password"
              type="password"
            />
            <ng-template #passwordErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >Password is required!</ng-container
              >
              <ng-container *ngIf="control.errors?.['minlength']"
                >Min 6 characters</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Role</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="roleErrorTpl">
            <nz-select formControlName="role" nzPlaceHolder="Select role">
              <nz-option nzValue="Teacher" nzLabel="Teacher"></nz-option>
              <nz-option nzValue="Student" nzLabel="Student"></nz-option>
              <nz-option nzValue="Admin" nzLabel="Admin"></nz-option>
            </nz-select>
            <ng-template #roleErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >Role is required!</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Status</nz-form-label>
          <nz-form-control [nzSpan]="14" [nzErrorTip]="statusErrorTpl">
            <nz-select formControlName="status" nzPlaceHolder="Select status">
              <nz-option nzValue="active" nzLabel="Active"></nz-option>
              <nz-option nzValue="inactive" nzLabel="Inactive"></nz-option>
            </nz-select>
            <ng-template #statusErrorTpl let-control>
              <ng-container *ngIf="control.errors?.['required']"
                >Status is required!</ng-container
              >
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control [nzSpan]="12">
            <button nz-button nzType="primary" [disabled]="!form.valid">
              @if(formMode() === FormModeEnum.Add){ Save } @else { Edit }
              <ng-template #saveText>Save</ng-template>
            </button>
            <button nz-button (click)="resetForm($event)">Reset</button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
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
    NzSelectModule,
    NzButtonModule,
  ],
})
export class FormComponent extends Form<User> implements OnInit {
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
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      role: ['Student', [Validators.required]], // default role
      status: ['active', [Validators.required]],
    });
  }

  /**
   * Find a record by its ID
   * @param id Record ID
   */
  override findById(id: number | string): Observable<User> {
    return this._repository.findById(id).pipe(
      tap((res: User) => {
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
  override parseIncomingResponse(model: User): void {
    this.form.patchValue({ ...model });
  }
  /**
   * Prepare form data to send to the API
   * @param form Reactive form instance
   */
  override prepareOutgoingRequest<R>(_model: User): R {
    // Pick only the fields you want to send
    const payload = {
      ..._model,
    } as unknown as R;

    return payload;
  }

  /**
   * Save a new record (Create)
   */
  save() {
    this._repository
      .save(this.prepareOutgoingRequest(this.form.value))
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
      .update(this.id(), this.prepareOutgoingRequest(this.form.value))
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
