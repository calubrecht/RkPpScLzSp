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
  winner: string;
  choices: string[];
  round: number;
  scores: number[];
}

export interface GameListener
{
  onMessage(msg : GameMessage);
}

export class GameStatus
{
  gameName : string;
  round : number;
  gameStatus : string;
  gameID : string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameListeners = [];
  inited = false;
  subscription : Subscription;
  gameStatus = new GameStatus();

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

  cancel()
  {
    this.api.sendPost<GameMessage>('game/cancel', {id:this.gameStatus.gameID}).subscribe(e=> { /* noop */}); 

  }
  
  onInit() {
    if (!this.inited)
    {
      this.subscription = this.subs.subscribeUserChannel<GameMessage>('/queue/game').
       subscribe(e => this.onMessage(e));
      this.inited = true;
      //this.gameStatus.gameStatus= 'started';
      //this.gameStatus.gameName= 'Black v. White';
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

  sendMessage(msg : GameMessage)
  {
    this.subs.sendMessage<GameMessage>("/send/gameMessage", msg);
  }

  startGame(name : string, id:string)
  {
    this.gameStatus.gameName = name;
    this.gameStatus.gameStatus = 'started'
    this.gameStatus.gameID = id;
  }
  
  endGame(name : string, id:string)
  {
    this.gameStatus.gameName = null;
    this.gameStatus.gameStatus = null;
    this.gameStatus.gameID = null;
  }

  getGameStatus()
  {
    return this.gameStatus.gameStatus;
  }
}
