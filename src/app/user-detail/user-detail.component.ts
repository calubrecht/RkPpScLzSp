import { Input, Component, OnInit } from '@angular/core';
import { UserData } from '../user-data';
import { UserLoginService } from '../user-login.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() user: UserData;

  constructor(public loginService: UserLoginService, private game: GameService) { }

  ngOnInit() {
  }

  invite() {
    this.game.invite(this.loginService.getName(), this.user.userName);
  }

}
