import { Component } from '@angular/core';
import { LoginComponent } from '@org/auth';

@Component({
  selector: 'app-login',
  template: `<lib-login-page/>`,
  standalone: true,
  imports: [LoginComponent],
})
export class AppLoginComponent {}
