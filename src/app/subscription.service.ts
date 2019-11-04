import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { WebsocketService } from './websocket.service';
import polling from 'rx-polling';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private subscriptions : Observable<any>[] = [];
  private unsubscribe = new Subject<void>();

  private lastSub = 0;

  private WSAPI;

  constructor(private api: ApiService, private wsService : WebsocketService)
  {
    this.WSAPI = this.api.WSAPI + '/' + this.api.WSENTRY;
  }

  newSubsID()
  {
    return this.lastSub++;
  }


  subscribe<T>(method: string ) : Observable<T>
  {

    let o = this.wsService.subscribe<T>(this.WSAPI, method);
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
