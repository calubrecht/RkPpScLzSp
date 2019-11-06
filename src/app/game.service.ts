import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SubscriptionService } from './subscription.service';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { StorageService } from './storage.service';


export class GameMessage
{
  id: string;
  action: string;
  detail: string;
  players: string[];
}



@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private api : ApiService,  private subs : SubscriptionService, private msg : MsgService, private storage : StorageService) { }

  seekGame() : Observable<GameMessage>
  {
    let obs = this.subs.subscribe<GameMessage>('/user/queue/game');
    this.api.sendPost<GameMessage>('game/seek', {}).subscribe(e=> { /* noop */}); 
    return obs;
  }
  
  endSeekGame() : void
  {
     this.api.sendPost<GameMessage>('game/endSeek', {}).subscribe(e=> { /* noop */}); 
  }
}
