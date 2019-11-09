import { Component, OnInit } from '@angular/core';
import { GameService, GameMessage, GameListener } from '../game.service';
import { Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-find-game-widget',
  templateUrl: './find-game-widget.component.html',
  styleUrls: ['./find-game-widget.component.css']
})
export class FindGameWidgetComponent implements OnInit, GameListener {

  isSeeking = false;
  inGame = false;
  seekingSubs : Subscription;
  gameDesc = '';
  listenerFunc;

  constructor( private game : GameService, private router : Router) { }
  
  ngOnInit() {
    this.game.onInit();}

  endSeek()
  {
    this.isSeeking = false;
    this.game.endSeekGame('findGameWidget');
  }

  cancelGame()
  {
    this.inGame = false;
    this.gameDesc = '';
  }

  startSeek()
  {
    this.isSeeking= true;
    let localThis = this;
    // XXX:Start seeking animation
    this.game.seekGame('findGameWidget', this);
  }

  onMessage(e : GameMessage)
  {
    console.log ('Got a game message')
    console.log ('GM.action=' + e.action);
    console.log ('GM.detail=' + e.detail);
    if (e.action == 'startGame')
    {
      this.inGame = true;
      this.gameDesc = e.detail;
      this.isSeeking = false;
      this.game.stopListen('findGameWidget');
      this.game.startGame(this.gameDesc);
      this.router.navigateByUrl("game");
    }
  }
}
