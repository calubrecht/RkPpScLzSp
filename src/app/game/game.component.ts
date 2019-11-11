import { Component, OnInit } from '@angular/core';
import { GameMessage, GameService } from '../game.service';
import { MsgService } from '../msg.service';
import { UserLoginService } from '../user-login.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  choices = ['scissors', 'paper', 'rock', 'paper', 'lizard', 'spock'];
  selectedElement;
  selectedName : string = 'placeholder';
  opponentSelectedName : string = 'placeholder';
  resultText : string = '';
  roundText : string = '';
  scoreText : string = '';

  constructor(public game : GameService, private msgService : MsgService, private loginService : UserLoginService) { }

  ngOnInit() {
    this.game.listen('gameWidget', this);
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
      this.selectedName = null;
    }
  }

  select(el)
  {
    if (this.selectedElement != null)
    {
      this.msgService.setMessage("Already selected for this round.");
      return;
    }
    if (this.game.gameStatus.gameStatus == 'Finished')
    {
      return ;
    }
    this.resultText = '';
    this.opponentSelectedName = 'placeholder';
    let id = el.id;
    this.unselect();
    this.selectedElement = el;
    this.selectedElement.classList.add('selected');
    this.selectedName = this.stripPrefix(id);
    this.callSelect(this.selectedName);
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

  setScore(roundNumber : number, playerScore : number, oppScore : number, oppName : string)
  {
    this.roundText = 'Round ' + roundNumber;
    this.scoreText = "You: " + playerScore + " " + oppName + ": " + oppScore;
  }
  
  onMessage(e : GameMessage)
  {
    this.msgService.clearMsgs();
    if (e.action == "point" || e.action == "TIE")
    {
      this.unselect();
      let playerIdx = (e.players[0] == this.loginService.getName()) ? 0 : 1;
      let oppIdx = playerIdx == 0 ? 1 : 0;
      this.resultText = e.detail;
      this.selectedName = e.choices[playerIdx];
      this.opponentSelectedName = e.choices[oppIdx];
      if (e.action == 'point')
      {
        this.setScore(e.round, e.scores[playerIdx], e.scores[oppIdx], e.players[oppIdx]);
      }
      return;
    }
    if (e.action == "Finished" || e.action == "Canceled")
    {
    }
    this.msgService.setMessage(e.detail);
  }
}
