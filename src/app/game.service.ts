import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SubscriptionService } from './subscription.service';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { StorageService } from './storage.service';


export class GameMessage
{
  id?: string;
  action: string;
  detail?: string;
  players?: string[];
  winner?: string;
  choices?: string[];
  round?: number;
  scores?: number[];
}

export interface GameListener
{
  onMessage(msg: GameMessage);
}

export class GameStatus
{
  gameName: string;
  round: number;
  gameStatus: string;
  gameID: string;

  selectedName: string;
  opponentSelectedName: string;
  resultText: string;
  roundText: string;
  scoreText: string;
  invited = false;
  inGame = false;
  inviter: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameListeners = [];
  inited = false;
  subscription: Subscription;
  gameStatus = new GameStatus();

  constructor(private api: ApiService,  private subs: SubscriptionService, private msg: MsgService, private storage: StorageService) { }

  seekGame(key: string, listener: GameListener)
  {
    this.api.sendPost<GameMessage>('game/seek', {}).subscribe(e => { /* noop */});
  }

  invite(inviter: string, invitee: string)
  {
    const inviteMessage: GameMessage = {action: 'invite', players: [inviter, invitee]};
    this.api.sendPost<GameMessage>('game/invite', inviteMessage).subscribe(e => { /* noop */});
  }

  acceptInvite(gameDesc: string, gameID: string)
  {
    const acceptMessage: GameMessage = {action: 'acceptInvite', id: gameID};
    this.api.sendPost<GameMessage>('game/acceptInvite', acceptMessage).subscribe(e => { /* noop */});
  }

  endSeekGame(key: string): void
  {
     this.api.sendPost<GameMessage>('game/endSeek', {}).subscribe(e => { /* noop */});
  }

  startAIGame(key: string, listener: GameListener)
  {
    this.api.sendPost<GameMessage>('game/startAIGame', {}).subscribe(e => { /* noop */});
  }

  cancel()
  {
    this.api.sendPost<GameMessage>('game/cancel', {id: this.gameStatus.gameID}).subscribe(e => { /* noop */});

  }

  onInit() {
    if (!this.inited)
    {
      this.subscription = this.subs.subscribeUserChannel<GameMessage>('/queue/game').
       subscribe(e => this.onMessage(e));
      this.inited = true;
      // this.gameStatus.gameStatus= 'started';
      // this.gameStatus.gameName= 'Black v. White';
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

  listen(key: string, listener: GameListener)
  {
    if (!this.gameListeners[key])
    {
      this.gameListeners[key] = listener;
    }
  }

  stopListen(key: string)
  {
    delete this.gameListeners[key];
  }

  onMessage(msg: GameMessage)
  {
    for (const key of Object.keys(this.gameListeners))
    {
      this.gameListeners[key].onMessage(msg);
    }
  }

  sendMessage(msg: GameMessage)
  {
    this.subs.sendMessage<GameMessage>('/send/gameMessage', msg);
  }

  startGame(name: string, id: string)
  {
    this.gameStatus.gameName = name;
    this.gameStatus.gameStatus = 'started';
    this.gameStatus.gameID = id;
    this.gameStatus.selectedName = 'placeholder';
    this.gameStatus.opponentSelectedName = 'placeholder';
    this.gameStatus.resultText = '';
    this.gameStatus.roundText = '';
    this.gameStatus.scoreText = '';
    this.gameStatus.invited = false;
    this.gameStatus.inGame = false;
  }

  endGame(name: string, id: string)
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
