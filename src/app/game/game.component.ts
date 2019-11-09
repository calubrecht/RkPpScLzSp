import { Component, OnInit } from '@angular/core';
import { GameMessage, GameService } from '../game.service';
import { MsgService } from '../msg.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  choices = ['scissors', 'paper', 'rock', 'paper', 'lizard', 'spock'];
  selectedElement;

  constructor(public game : GameService, private msgService : MsgService) { }

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
    }
  }

  select(el)
  {
    let id = el.id;
    this.unselect();
    this.selectedElement = el;
    this.selectedElement.classList.add('selected');
    this.callSelect(this.stripPrefix(id));
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
  
  onMessage(e : GameMessage)
  {
    this.msgService.setMessage(e.detail);
  }
}
