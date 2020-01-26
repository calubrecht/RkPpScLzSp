import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import {  of } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsgService } from './msg.service';
import { StorageService } from './storage.service';
import { UserLoginService } from './user-login.service';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private storage: StorageService, private msgService: MsgService, private user: UserLoginService) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this.storage.getToken();

        let reqToHandle = req;

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + idToken)
            });
            reqToHandle = cloned;
        }
        return next.handle(reqToHandle).pipe(
          tap(
           event => {}), // success,
          catchError((err: any, o: Observable<any>) => {
            this.handleError(err);
            return of();
        }));
    }

  handleError(err: any)
  {
    if (err instanceof HttpErrorResponse)
    {
      if (err.status === 401)
      {
        if (typeof err.error === 'object')
        {
          this.user.logOutClient(err.error.userName);
        }
        else
        {
          this.user.logOutClient(err.error);
        }
      }
      else if (err.status === 0)
      {
        this.user.logOutClientLocal('Error communicating with server.');
      }
      else
      {
        this.msgService.setError(err.error);
      }
    }
    else
    {
      this.msgService.setError('Unknown Error');
    }
  }
}
