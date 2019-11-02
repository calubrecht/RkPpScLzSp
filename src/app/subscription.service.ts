import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import polling from 'rx-polling';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private subscriptions : Observable<any>[] = [];
  private unsubscribe = new Subject<void>();

  constructor(private api: ApiService)
  {
  }

  subscribe<T>(method: string, interval : number ) : Observable<T>
  {
    let o = polling(
      this.api.sendGet<T>(method),
      {interval : interval }).
      pipe(takeUntil(this.unsubscribe));
    this.subscriptions.push(o);
    return o;

  }

  unsubscribeAll()
  {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.subscriptions = [];
  }
}
