import { Input, Component, OnInit } from '@angular/core';
import { UserData } from '../user-data';
import { UserLoginService } from '../user-login.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(public loginService : UserLoginService) { }

  ngOnInit() {
  }

  @Input() user : UserData;

}
