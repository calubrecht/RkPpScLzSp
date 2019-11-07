import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

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

export interface GameListener
{
  onMessage(msg : GameMessage);
}



@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameListeners = [];
  inited = false;
  subscription : Subscription;

  constructor(private api : ApiService,  private subs : SubscriptionService, private msg : MsgService, private storage : StorageService) { }

  seekGame(key: string, listener : GameListener) 
  {
    this.listen(key, listener);
    this.api.sendPost<GameMessage>('game/seek', {}).subscribe(e=> { /* noop */}); 
  }
  
  endSeekGame(key: string) : void
  {
     this.api.sendPost<GameMessage>('game/endSeek', {}).subscribe(e=> { /* noop */}); 
     this.stopListen(key);
  }
  
  onInit() {
    if (!this.inited)
    {
      this.subscription = this.subs.subscribeUserChannel<GameMessage>('/queue/game').
       subscribe(e => this.onMessage(e));
      this.inited = true;
    }
  }

  unsubscribe()
  {
    if (this.subscription)
    {
      this.subscription.unsubscribe();
    }
    this.inited = false;
  }

  listen(key: string, listener : GameListener)
  {
    this.gameListeners[key] = listener;
  }

  stopListen(key:string)
  {
    delete this.gameListeners[key];
  }

  onMessage(msg : GameMessage)
  {
    for (let key in this.gameListeners)
    {
      this.gameListeners[key].onMessage(msg);
    }
  }
}
