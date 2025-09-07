import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import {  inject } from '@angular/core';
import { IGNORE_BASE_URL, _HttpClient } from '@delon/theme';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject<ITokenService>(DA_SERVICE_TOKEN);
  const message = inject(NzMessageService);
  const router = inject(Router);

  const token = tokenService.get()?.token;

  let url = req.url;
  if (
    !req.context.get(IGNORE_BASE_URL) &&
    !url.startsWith('https://') &&
    !url.startsWith('http://')
  ) {
    const  baseUrl  = 'http://localhost:8000/api/v1';
    url =
      baseUrl +
      (baseUrl.endsWith('/') && url.startsWith('/')
        ? url.substring(1)
        : url);
  }

  // ✅ build headers
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: 'application/json',
  };

  const newReq = req.clone({ url, setHeaders: headers });

  return next(newReq).pipe(
    mergeMap((ev) => {
      if (ev instanceof HttpResponseBase) {
        return handleData(ev, message, router, tokenService);
      }
      return of(ev);
    }),
    catchError((err: HttpErrorResponse) => {
      return handleData(err, message, router, tokenService);
    }),
  );
};

// === Centralized handling for responses & errors ===
function handleData(
  ev: HttpResponseBase | HttpErrorResponse,
  message: NzMessageService,
  router: Router,
  tokenService: ITokenService,
): Observable<any> {
  // success
  if (ev instanceof HttpResponse) {
    return of(ev);
  }

  // error handling
  const status = ev.status;

switch (status) {
  case 0: // network error
    message.error('Network error. Please check your connection.');
    break;

  case 401: // unauthorized
    message.error('Session expired, please login again.');
    tokenService.clear();
    router.navigateByUrl('/login');
    break;

  case 403:
    message.error('You do not have permission to perform this action.');
    break;

  case 404:
    message.error('Requested resource not found.');
    break;

  case 422: // validation error (custom if your API uses it)
    if ((ev as any).error?.errors) {
      Object.values((ev as any).error.errors).forEach((err: any) => {
        message.error(err.message);
      });
    } else {
      message.error((ev as any).error?.message || 'Validation error.');
    }
    break;

  case 500:
    // fallback for other errors
    if ((ev as any).error?.errors) {
      Object.values((ev as any).error.errors).forEach((err: any) => {
        message.error(err.message);
      });
    } else {
      message.error(
        (ev as any).error?.message || `Unexpected error: ${status}`,
      );
    }    break;

  default:
;
}


  return throwError(() => ev);
}
