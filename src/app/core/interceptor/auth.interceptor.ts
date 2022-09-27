import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError, EMPTY } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private sessionService: SessionService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { accessToken } = this.sessionService;
    let authReq;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    } else {
      authReq = req.clone();
    }

    return next.handle(authReq).pipe((source) => this.handleAuthErrors(source));
  }

  handleAuthErrors(
    source: Observable<HttpEvent<any>>
  ): Observable<HttpEvent<any>> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        const authResHeader = error.headers.get('WWW-Authenticate') || '';
        if (error.status === 401) {
          if (/is expired/.test(authResHeader)) {
            // TODO: Another option is to refresh token
            // this.sessionService.refreshToken();
            this.router.navigate(['signin']);
          } else {
            this.router.navigate(['authfailed']);
          }
          return EMPTY;
        } else {
          return throwError(error);
        }
      })
    );
  }
}
