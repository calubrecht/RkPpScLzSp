import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { FormsModule } from '@angular/forms' ;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private loginService: UserLoginService, private router: Router) {
  }

  userName : string;
  password : string;

  ngOnInit() {
    if(this.loginService.isLoggedIn())
    {
      this.navigateAway();
    }
  }

  navigateAway()
  {
    this.router.navigateByUrl("lobby");
  }

  register()
  {
    this.router.navigateByUrl("register");
  }

  tryLogin()
  {
    this.loginService.logIn(this.userName, this.password);
  }
  
  tryLoginGuest()
  {
    this.loginService.logInGuest();
  }

}
