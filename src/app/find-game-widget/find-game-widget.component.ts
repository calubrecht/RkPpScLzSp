import { Component, OnInit } from '@angular/core';
import { GameService, GameMessage } from '../game.service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-find-game-widget',
  templateUrl: './find-game-widget.component.html',
  styleUrls: ['./find-game-widget.component.css']
})
export class FindGameWidgetComponent implements OnInit {

  isSeeking = false;
  inGame = false;
  seekingSubs : Subscription;
  gameDesc = '';

  constructor( private game : GameService) { }

  ngOnInit() {
  }

  endSeek()
  {
    this.isSeeking = false;
    this.game.endSeekGame();
    this.seekingSubs.unsubscribe();
  }

  cancelGame()
  {
    this.inGame = false;
    this.gameDesc = '';
  }

  cLog(msg )
  {
    console.log(msg);
  }

  startSeek()
  {
    this.isSeeking= true;
    let localThis = this;
    // XXX:Start seeking animation
    this.seekingSubs = this.game.seekGame().
      subscribe(
        e=> { this.processMsg(e)});

  }

  processMsg(e : GameMessage)
  {
    if (e.action == 'startGame')
    {
      this.inGame = true;
      this.gameDesc = e.detail;
      this.isSeeking = false;
      this.seekingSubs.unsubscribe();
    }
  }
}
