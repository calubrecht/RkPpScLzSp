import { Input, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../user-data';
import { UserLoginService } from '../user-login.service';
import { GameService, GameListener, GameMessage } from '../game.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [CommonModule],
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, GameListener{
  @Input() user: UserData;
  inviteStatus = "";

  constructor(public loginService: UserLoginService, private game: GameService) { }

  ngOnInit() {
  }

  invite() {
    this.inviteStatus = "You invited " + this.user.userName + " to a game";
    this.game.invite(this.loginService.getName(), this.user.userName, this);
  }
  
  onMessage(msg: GameMessage)
  {
    if (msg.action === "refuseInvite" && msg.detail === this.user.userName)
    {
      this.inviteStatus = "Invitation refused";
    }
  }

}
