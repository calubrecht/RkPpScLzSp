import { Component, OnInit } from '@angular/core';
import { GameMessage, GameService } from '../game.service';
import { MsgService } from '../msg.service';
import { UserLoginService } from '../user-login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  choices = ['scissors', 'paper', 'rock', 'paper', 'lizard', 'spock'];
  selectedElement;

  cancelButtonName = 'Cancel Game';

  constructor(public game : GameService, private msgService : MsgService, private loginService : UserLoginService, private router : Router) { }

  ngOnInit() {
    this.game.listen('gameWidget', this);
    if (this.game.gameStatus.gameStatus=='finished')
    {
      this.cancelButtonName = 'Close Game';
    }
  }

  getChoices() : string[]
  {
    return this.choices;
  }

  unselect()
  {
    if (this.selectedElement)
    {
      this.selectedElement.classList.remove('selected');
      this.selectedElement = null;
      this.game.gameStatus.selectedName = null;
    }
  }

  select(el)
  {
    if (this.selectedElement != null)
    {
      this.msgService.setMessage("Already selected for this round.");
      return;
    }
    if (this.game.gameStatus.gameStatus == 'finished')
    {
      return ;
    }
    this.game.gameStatus.resultText = '';
    this.game.gameStatus.opponentSelectedName = 'placeholder';
    let id = el.id;
    this.unselect();
    this.selectedElement = el;
    this.selectedElement.classList.add('selected');
    this.game.gameStatus.selectedName = this.stripPrefix(id);
    this.callSelect(this.game.gameStatus.selectedName);
  }

  stripPrefix(id : string)
  {
    return id.substring(5);
  }

  callSelect(choice : string)
  {
    let gm = new GameMessage();
    gm.id = this.game.gameStatus.gameID;
    gm.action = 'makeChoice';
    gm.detail = choice;
    this.game.sendMessage(gm);
  }

  close()
  {
    this.game.stopListen('gameWidget');
    if (this.game.getGameStatus() == 'started')
    {
      // Canceling active game
      this.game.cancel();
    }
    this.game.gameStatus.gameStatus = 'closed';
    this.router.navigateByUrl('/lobby');
  }

  setScore(roundNumber : number, playerScore : number, oppScore : number, oppName : string)
  {
    this.game.gameStatus.roundText = 'Round ' + roundNumber;
    this.game.gameStatus.scoreText = "You: " + playerScore + " " + oppName + ": " + oppScore;
  }
  
  onMessage(e : GameMessage)
  {
    this.msgService.clearMsgs();
    if (e.action == "point" || e.action == "TIE")
    {
      this.unselect();
      let playerIdx = (e.players[0] == this.loginService.getName()) ? 0 : 1;
      let oppIdx = playerIdx == 0 ? 1 : 0;
      this.game.gameStatus.resultText = e.detail;
      this.game.gameStatus.selectedName = e.choices[playerIdx];
      this.game.gameStatus.opponentSelectedName = e.choices[oppIdx];
      if (e.action == 'point')
      {
        this.setScore(e.round, e.scores[playerIdx], e.scores[oppIdx], e.players[oppIdx]);
      }
      return;
    }
    if (e.action == "Finished" || e.action == "Canceled")
    {
      this.game.gameStatus.gameStatus='finished';
      if (this.selectedElement)
      { 
        this.selectedElement.classList.remove('selected');
        this.selectedElement = null;
      }
      this.cancelButtonName = 'Close Game';
      if (e.action == 'Canceled')
      {
        this.game.gameStatus.roundText = ''
        this.game.gameStatus.scoreText = "Game Canceled";
      }
      else
      {
        this.game.gameStatus.roundText = 'Game Over'
        this.game.gameStatus.scoreText = e.detail;
      }
      return;
    }
    this.msgService.setMessage(e.detail);
  }
}
