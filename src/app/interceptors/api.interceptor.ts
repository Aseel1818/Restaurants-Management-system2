import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
export const InterceptorSkip = 'signin';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers && request.headers.has(InterceptorSkip)) {
      return next.handle(request);
    }
    const secureReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('accessToken'))
    });
    return next.handle(secureReq);
  }
}
