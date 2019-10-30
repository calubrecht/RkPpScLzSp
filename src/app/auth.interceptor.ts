import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CustomerService } from './customer.service';
import { MsgService } from './msg.service';

@Injectable({providedIn:"root"})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private cust : CustomerService, private msgService : MsgService) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this.cust.getToken();

        var reqToHandle = req;

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });
            reqToHandle = cloned;
        }
        return next.handle(reqToHandle).pipe(
          tap(
           event => {}, // success,
           (err :any) => {
              this.cust.logOutClient('ips');
	      this.handleError(err)}));
    }

  handleError(err : any)
  {
    if (err instanceof HttpErrorResponse)
    {
      this.msgService.setError(err.error);
      if (err.status == 401)
      {
        this.cust.logOutClient('ips') ;
      }
    }
    else
    {
      this.msgService.setError("Unknown Error");
    }
  }
}
