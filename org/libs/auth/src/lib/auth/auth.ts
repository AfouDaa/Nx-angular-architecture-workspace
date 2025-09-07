import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nPipe, _HttpClient } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabChangeEvent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { finalize } from 'rxjs';
import { LocalStorageService } from '@org/utillitys';
import { ALLOW_ANONYMOUS, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-login-page',
  templateUrl: './auth.html',
  styleUrls: ['./auth.less'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    I18nPipe,
    NzCheckboxModule,
    NzTabsModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
})
export class LoginComponent implements OnDestroy {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);

  private readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly message = inject(NzMessageService);
  private readonly LocalStorageService = inject(LocalStorageService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  error = '';
  type = 0;
  loading = false;

  count = 0;
  interval$: any;

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
  }

  submit(): void {
    this.error = '';
    const { email, password } = this.form.controls;
    email.markAsDirty();
    email.updateValueAndValidity();
    password.markAsDirty();
    password.updateValueAndValidity();
    if (email.invalid || password.invalid) {
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    this.http
      .post(
        'http://localhost:8000/api/v1/auth/login',
        {
          email: this.form.value.email,
          password: this.form.value.password,
        },
        null,
        {
          context: new HttpContext().set(ALLOW_ANONYMOUS, true),
        }
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )

      .subscribe(
        (res) => {
          if (!res) {
            this.error = res.msg;
            this.cdr.detectChanges();
            return;
          }
          this.tokenService.set({ token: res.token });
          this.LocalStorageService.setUser(res.data);
          this.router.navigateByUrl('user');
        },
        (err) => {
          this.message.create('error', ` ${err.error.message}`);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
