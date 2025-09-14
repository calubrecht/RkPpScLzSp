import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { FormsModule } from '@angular/forms' ;
import { MsgComponent } from '../msg/msg.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, MsgComponent]
  
})
export class LoginComponent implements OnInit {

  constructor( private loginService: UserLoginService, private router: Router) {
  }

  userName: string;
  password: string;

  ngOnInit() {
    this.loginService.initSession();
    if (this.loginService.isLoggedIn())
    {
      this.navigateAway();
    }
  }

  navigateAway()
  {
    this.router.navigateByUrl('lobby');
  }

  register()
  {
    this.router.navigateByUrl('register');
    return false;
  }

  tryLogin()
  {
    this.loginService.logIn(this.userName, this.password);
    return false;
  }

  tryLoginGuest()
  {
    this.loginService.logInGuest();
    return false;
  }

}
