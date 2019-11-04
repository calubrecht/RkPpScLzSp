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

  email : string;
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

  tryLogin()
  {
    this.loginService.logIn(this.email, this.password);
  }

}
