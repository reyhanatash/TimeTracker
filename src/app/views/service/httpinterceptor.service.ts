import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as alertify from '../../../assets/alertify.js';
import { finalize, tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private _router:Router){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    return next.handle(request).pipe(
      tap(event=>{}, error => {
          if (error.status === 401) {
            // alertify.error(
            //   'We have an authentication problem. Please try again.'
            // );
            localStorage.removeItem('token');
            this._router.navigate(['/'])
          }
        }
      ),

      // Log when response observable either completes or errors
      finalize(() => {

      })
    );
  }
}
