import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { GameService } from '../game.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  constructor(private router: Router, public game: GameService) { }

  ngOnInit() {
  }

  inLobby()
  {
    return this.router.url.endsWith('/lobby');
  }

  toLobby()
  {
    if (!this.inLobby())
    {
      this.router.navigateByUrl('lobby');
    }
  }
  toGame()
  {
    if (this.inLobby())
    {
      this.router.navigateByUrl('game');
    }
  }
}
