import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  choices = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
  selectedElement :string;

  constructor(private game : GameService) { }

  ngOnInit() {
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
    // this.callSelect(stripPrefix(id);
  }
}
