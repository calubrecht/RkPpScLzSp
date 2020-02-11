import { Component, OnInit } from '@angular/core';
import { GameService, GameMessage, GameListener } from '../game.service';
import { UsersData } from '../user-data';
import { Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-find-game-widget',
  templateUrl: './find-game-widget.component.html',
  styleUrls: ['./find-game-widget.component.css']
})
export class FindGameWidgetComponent implements OnInit, GameListener {

  isSeeking = false;
  seekingLongTime = false;
  seekingTimer : number;
  seekingSubs: Subscription;
  listenerFunc;

  constructor( public game: GameService, private router: Router, public userData: UsersData) { }

  ngOnInit() {
    this.game.onInit();
    this.game.listen('findGameWidget', this);
  }

  endSeek()
  {
    this.isSeeking = false;
    this.seekingLongTime = false;
    this.game.endSeekGame('findGameWidget');
    this.game.gameStatus.inGame = false;
    this.game.gameStatus.invited = false;
    clearInterval(this.seekingTimer);
    this.seekingTimer = null;
  }

  cancelGame()
  {
    this.game.gameStatus.inGame = false;
    this.game.gameStatus.gameName = '';
    this.game.gameStatus.invited = false;
  }

  acceptInvite()
  {
    this.game.gameStatus.inGame = true;
    this.game.startGame(this.game.gameStatus.gameName, this.game.gameStatus.gameID);
    this.game.acceptInvite(this.game.gameStatus.gameName, this.game.gameStatus.gameID);
    this.game.gameStatus.inviter = '';
    this.router.navigateByUrl('game');
  }

  startSeek()
  {
    this.isSeeking = true;
    this.seekingLongTime = false;
    // XXX:Start seeking animation
    this.game.seekGame('findGameWidget', this);
    if (this.seekingTimer)
    {
      clearInterval(this.seekingTimer);
    }
    this.seekingTimer = setInterval(() => {
      this.seekingLongTime = true;
    },30000);
  }

  aiGame()
  {
    this.isSeeking = false
    this.game.endSeekGame('findGameWidget');
    this.game.startAIGame('findGameWidget', this);
  }

  onMessage(e: GameMessage)
  {
    if (e.action === 'startGame')
    {
      this.game.gameStatus.inGame = true;
      this.game.gameStatus.gameName = e.detail;
      this.isSeeking = false;
      this.game.startGame(this.game.gameStatus.gameName, e.id);
      this.router.navigateByUrl('game');
    }
    if (e.action === 'invite' && !this.game.gameStatus.inGame && !this.game.gameStatus.invited)
    {
      this.game.gameStatus.invited = true;
      this.game.gameStatus.gameName = e.detail;
      this.game.gameStatus.gameID = e.id;
      this.game.gameStatus.inviter = e.players[1];
    }
    if (e.action === 'acceptedInvite' && !this.game.gameStatus.inGame )
    {
      this.game.gameStatus.inGame = true;
      this.game.gameStatus.invited = false;
      this.game.gameStatus.gameName = e.detail;
      this.game.startGame(this.game.gameStatus.gameName, e.id);
      this.game.gameStatus.inviter = '';
      this.router.navigateByUrl('game');
    }
  }
}
